package tests

import (
	"encoding/json"
	"net/http"
	"strconv"
	"testing"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestIntegrationValidationRBACAndCartEdgeFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	store, router := setupObservabilityIntegrationRouter(t)

	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")
	staffToken := loginAndExtractToken(t, router, "staff1@fishmarket.com", "password123")
	customerToken := loginAndExtractToken(t, router, "customer1@fishmarket.com", "password123")

	customerCreatePond := performJSONRequest(t, router, http.MethodPost, "/api/ponds", map[string]interface{}{
		"name":        "Kolam Customer",
		"location":    "Zona A",
		"capacity":    1000,
		"area":        20,
		"water_type":  "freshwater",
		"description": "should fail",
	}, customerToken)
	require.Equal(t, http.StatusForbidden, customerCreatePond.Code)

	invalidPond := performJSONRequest(t, router, http.MethodPost, "/api/ponds", map[string]interface{}{
		"name":        "",
		"location":    "Zona B",
		"capacity":    -1,
		"area":        -1,
		"water_type":  "freshwater",
		"description": "invalid",
	}, adminToken)
	require.Equal(t, http.StatusBadRequest, invalidPond.Code)
	assert.Contains(t, invalidPond.Body.String(), `"message":"Validation failed"`)

	pondID := createIntegrationPond(t, router, adminToken, "Kolam Validation")

	store.mu.Lock()
	store.ponds[pondID].Status = "inactive"
	store.mu.Unlock()

	inactiveBatch := performJSONRequest(t, router, http.MethodPost, "/api/batches", map[string]interface{}{
		"pond_id":          pondID,
		"fish_type":        "Nila",
		"seed_count":       500,
		"average_weight":   0.05,
		"start_date":       "2026-08-01",
		"expected_harvest": "2026-12-01",
	}, staffToken)
	require.Equal(t, http.StatusBadRequest, inactiveBatch.Code)
	assert.Contains(t, inactiveBatch.Body.String(), `"message":"Pond is not active"`)

	store.mu.Lock()
	store.ponds[pondID].Status = "active"
	store.mu.Unlock()

	missingPondBatch := performJSONRequest(t, router, http.MethodPost, "/api/batches", map[string]interface{}{
		"pond_id":          99999,
		"fish_type":        "Nila",
		"seed_count":       500,
		"average_weight":   0.05,
		"start_date":       "2026-08-01",
		"expected_harvest": "2026-12-01",
	}, staffToken)
	require.Equal(t, http.StatusBadRequest, missingPondBatch.Code)
	assert.Contains(t, missingPondBatch.Body.String(), `"message":"Pond not found"`)

	batchID := createIntegrationBatch(t, router, staffToken, pondID, "Nila")

	invalidFeedBatch := performJSONRequest(t, router, http.MethodPost, "/api/feeding-logs", map[string]interface{}{
		"fish_batch_id": 99999,
		"feed_type":     "Pelet PF-1000",
		"feed_amount":   25,
		"feed_time":     "2026-08-15T08:00:00Z",
		"notes":         "invalid batch",
	}, staffToken)
	require.Equal(t, http.StatusBadRequest, invalidFeedBatch.Code)
	assert.Contains(t, invalidFeedBatch.Body.String(), `"message":"Fish batch not found"`)

	invalidFeedPayload := performJSONRequest(t, router, http.MethodPost, "/api/feeding-logs", map[string]interface{}{
		"fish_batch_id": batchID,
		"feed_type":     "",
		"feed_amount":   0,
		"feed_time":     "2026-08-15T08:00:00Z",
		"notes":         "invalid payload",
	}, staffToken)
	require.Equal(t, http.StatusBadRequest, invalidFeedPayload.Code)
	assert.Contains(t, invalidFeedPayload.Body.String(), `"message":"Validation failed"`)

	invalidHarvestBatch := performJSONRequest(t, router, http.MethodPost, "/api/harvests", map[string]interface{}{
		"fish_batch_id":  99999,
		"harvest_date":   "2026-12-01",
		"total_weight":   100,
		"fish_count":     100,
		"average_weight": 1,
		"notes":          "invalid batch",
	}, adminToken)
	require.Equal(t, http.StatusBadRequest, invalidHarvestBatch.Code)
	assert.Contains(t, invalidHarvestBatch.Body.String(), `"message":"Fish batch not found"`)

	invalidHarvestPayload := performJSONRequest(t, router, http.MethodPost, "/api/harvests", map[string]interface{}{
		"fish_batch_id":  batchID,
		"harvest_date":   "2026-12-01",
		"total_weight":   0,
		"fish_count":     0,
		"average_weight": 0,
		"notes":          "invalid payload",
	}, adminToken)
	require.Equal(t, http.StatusBadRequest, invalidHarvestPayload.Code)
	assert.Contains(t, invalidHarvestPayload.Body.String(), `"message":"Validation failed"`)

	customerInventory := performJSONRequest(t, router, http.MethodGet, "/api/inventory", nil, customerToken)
	require.Equal(t, http.StatusForbidden, customerInventory.Code)

	customerDashboard := performJSONRequest(t, router, http.MethodGet, "/api/dashboard", nil, customerToken)
	require.Equal(t, http.StatusForbidden, customerDashboard.Code)

	customerActivityLogs := performJSONRequest(t, router, http.MethodGet, "/api/activity-logs", nil, customerToken)
	require.Equal(t, http.StatusForbidden, customerActivityLogs.Code)

	trackingNotFound := performJSONRequest(t, router, http.MethodGet, "/api/tracking/BTCH-2099-9999", nil, "")
	require.Equal(t, http.StatusNotFound, trackingNotFound.Code)
	assert.Contains(t, trackingNotFound.Body.String(), `"message":"Batch not found"`)

	invalidReportType := performJSONRequest(t, router, http.MethodGet, "/api/reports/export/excel?type=invalid", nil, adminToken)
	require.Equal(t, http.StatusBadRequest, invalidReportType.Code)
	assert.Contains(t, invalidReportType.Body.String(), `"message":"Invalid report type"`)

	invalidCartQuantity := performJSONRequest(t, router, http.MethodPost, "/api/cart", map[string]interface{}{
		"product_id": 1,
		"quantity":   0,
	}, customerToken)
	require.Equal(t, http.StatusBadRequest, invalidCartQuantity.Code)
	assert.Contains(t, invalidCartQuantity.Body.String(), `"message":"Validation failed"`)

	missingProductCart := performJSONRequest(t, router, http.MethodPost, "/api/cart", map[string]interface{}{
		"product_id": 99999,
		"quantity":   1,
	}, customerToken)
	require.Equal(t, http.StatusNotFound, missingProductCart.Code)
	assert.Contains(t, missingProductCart.Body.String(), `"message":"Product not found"`)

	emptyCheckout := performJSONRequest(t, router, http.MethodPost, "/api/checkout", map[string]interface{}{
		"shipping_address": "Alamat kosong",
	}, customerToken)
	require.Equal(t, http.StatusBadRequest, emptyCheckout.Code)
	assert.Contains(t, emptyCheckout.Body.String(), `"message":"Cart is empty"`)

	product := store.addProduct(&models.Product{
		Name:        "Ikan Cart Edge",
		Description: "Produk untuk cart edge case",
		Price:       45000,
		Stock:       100,
		Category:    "Ikan",
		Status:      "active",
	})
	store.linkProductToBatch(product.ID, batchID)

	harvestForInventory := performJSONRequest(t, router, http.MethodPost, "/api/harvests", map[string]interface{}{
		"fish_batch_id":  batchID,
		"harvest_date":   "2026-12-10",
		"total_weight":   10,
		"fish_count":     10,
		"average_weight": 1,
		"notes":          "seed inventory for cart",
	}, adminToken)
	require.Equal(t, http.StatusCreated, harvestForInventory.Code)

	adminAddCart := performJSONRequest(t, router, http.MethodPost, "/api/cart", map[string]interface{}{
		"product_id": product.ID,
		"quantity":   1,
	}, adminToken)
	require.Equal(t, http.StatusForbidden, adminAddCart.Code)

	firstAddCart := performJSONRequest(t, router, http.MethodPost, "/api/cart", map[string]interface{}{
		"product_id": product.ID,
		"quantity":   1,
	}, customerToken)
	require.Equal(t, http.StatusCreated, firstAddCart.Code)

	secondAddCart := performJSONRequest(t, router, http.MethodPost, "/api/cart", map[string]interface{}{
		"product_id": product.ID,
		"quantity":   2,
	}, customerToken)
	require.Equal(t, http.StatusCreated, secondAddCart.Code)
	assert.Contains(t, secondAddCart.Body.String(), `"quantity":3`)

	cartList := performJSONRequest(t, router, http.MethodGet, "/api/cart", nil, customerToken)
	require.Equal(t, http.StatusOK, cartList.Code)
	assert.Contains(t, cartList.Body.String(), `"quantity":3`)
	assert.Contains(t, cartList.Body.String(), `"total_price":135000`)

	var cartListResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(cartList.Body.Bytes(), &cartListResponse))
	cartData := cartListResponse.Data.(map[string]interface{})
	cartItems := cartData["items"].([]interface{})
	cartID := int(cartItems[0].(map[string]interface{})["id"].(float64))

	excessiveCartUpdate := performJSONRequest(t, router, http.MethodPut, "/api/cart/"+strconv.Itoa(cartID), map[string]interface{}{
		"quantity": 9999,
	}, customerToken)
	require.Equal(t, http.StatusBadRequest, excessiveCartUpdate.Code)
	assert.Contains(t, excessiveCartUpdate.Body.String(), `"message":"Inventory is not enough"`)

	checkoutSuccess := performJSONRequest(t, router, http.MethodPost, "/api/checkout", map[string]interface{}{
		"shipping_address": "Jl. Integrasi QA No. 1",
		"payment_method":   "cod",
	}, customerToken)
	require.Equal(t, http.StatusCreated, checkoutSuccess.Code)
	assert.Contains(t, checkoutSuccess.Body.String(), `"invoice":"INV-`)

	orderList := performJSONRequest(t, router, http.MethodGet, "/api/orders", nil, customerToken)
	require.Equal(t, http.StatusOK, orderList.Code)
	assert.Contains(t, orderList.Body.String(), `"invoice_number":"INV-`)

	var orderListResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(orderList.Body.Bytes(), &orderListResponse))
	orderData := orderListResponse.Data.(map[string]interface{})
	orderItems := orderData["items"].([]interface{})
	orderID := int(orderItems[0].(map[string]interface{})["id"].(float64))

	invalidOrderStatus := performJSONRequest(t, router, http.MethodPut, "/api/orders/"+strconv.Itoa(orderID)+"/status", map[string]interface{}{
		"status": "invalid",
	}, adminToken)
	require.Equal(t, http.StatusBadRequest, invalidOrderStatus.Code)
	assert.Contains(t, invalidOrderStatus.Body.String(), `"message":"Validation failed"`)

	invalidPaymentStatus := performJSONRequest(t, router, http.MethodPut, "/api/orders/"+strconv.Itoa(orderID)+"/payment", map[string]interface{}{
		"payment_status": "invalid",
	}, adminToken)
	require.Equal(t, http.StatusBadRequest, invalidPaymentStatus.Code)
	assert.Contains(t, invalidPaymentStatus.Body.String(), `"message":"Validation failed"`)

	notifications := performJSONRequest(t, router, http.MethodGet, "/api/notifications", nil, customerToken)
	require.Equal(t, http.StatusOK, notifications.Code)
	assert.Contains(t, notifications.Body.String(), `"type":"ORDER"`)

	var notificationsResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(notifications.Body.Bytes(), &notificationsResponse))
	notificationData := notificationsResponse.Data.(map[string]interface{})
	notificationItems := notificationData["items"].([]interface{})
	require.NotEmpty(t, notificationItems)
	notificationID := int(notificationItems[0].(map[string]interface{})["id"].(float64))

	markNotificationRead := performJSONRequest(t, router, http.MethodPut, "/api/notifications/"+strconv.Itoa(notificationID)+"/read", nil, customerToken)
	require.Equal(t, http.StatusOK, markNotificationRead.Code)
	assert.Contains(t, markNotificationRead.Body.String(), `"message":"Notification marked as read"`)
}
