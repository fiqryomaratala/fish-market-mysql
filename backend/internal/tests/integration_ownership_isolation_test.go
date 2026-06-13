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

func TestIntegrationOwnershipAndIsolationFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	store, router := setupObservabilityIntegrationRouter(t)

	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")
	customerOneToken := loginAndExtractToken(t, router, "customer1@fishmarket.com", "password123")

	registerCustomerTwo := performJSONRequest(t, router, http.MethodPost, "/api/auth/register", map[string]string{
		"name":     "Customer Dua",
		"email":    "customer2.integration@example.com",
		"password": "password123",
	}, "")
	require.Equal(t, http.StatusCreated, registerCustomerTwo.Code)

	customerTwoToken := loginAndExtractToken(t, router, "customer2.integration@example.com", "password123")

	pondID := createIntegrationPond(t, router, adminToken, "Kolam Isolasi")
	batchID := createIntegrationBatch(t, router, adminToken, pondID, "Lele")

	product := store.addProduct(&models.Product{
		Name:        "Ikan Lele Isolasi",
		Description: "Produk untuk test ownership",
		Price:       25000,
		Stock:       200,
		Category:    "Ikan",
		Status:      "active",
	})
	store.linkProductToBatch(product.ID, batchID)

	harvestRecorder := performJSONRequest(t, router, http.MethodPost, "/api/harvests", map[string]interface{}{
		"fish_batch_id":  batchID,
		"harvest_date":   "2026-12-10",
		"total_weight":   50,
		"fish_count":     50,
		"average_weight": 1,
		"notes":          "stok ownership",
	}, adminToken)
	require.Equal(t, http.StatusCreated, harvestRecorder.Code)

	addToCart := performJSONRequest(t, router, http.MethodPost, "/api/cart", map[string]interface{}{
		"product_id": product.ID,
		"quantity":   2,
	}, customerOneToken)
	require.Equal(t, http.StatusCreated, addToCart.Code)

	checkoutRecorder := performJSONRequest(t, router, http.MethodPost, "/api/checkout", map[string]interface{}{
		"shipping_address": "Jl. Customer Satu",
	}, customerOneToken)
	require.Equal(t, http.StatusCreated, checkoutRecorder.Code)

	customerOneOrders := performJSONRequest(t, router, http.MethodGet, "/api/orders", nil, customerOneToken)
	require.Equal(t, http.StatusOK, customerOneOrders.Code)

	var ordersResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(customerOneOrders.Body.Bytes(), &ordersResponse))
	orderData := ordersResponse.Data.(map[string]interface{})
	orderItems := orderData["items"].([]interface{})
	require.NotEmpty(t, orderItems)
	orderID := int(orderItems[0].(map[string]interface{})["id"].(float64))

	customerTwoOrders := performJSONRequest(t, router, http.MethodGet, "/api/orders", nil, customerTwoToken)
	require.Equal(t, http.StatusOK, customerTwoOrders.Code)
	assert.Contains(t, customerTwoOrders.Body.String(), `"items":[]`)

	customerTwoOrderDetail := performJSONRequest(t, router, http.MethodGet, "/api/orders/"+strconv.Itoa(orderID), nil, customerTwoToken)
	require.Equal(t, http.StatusForbidden, customerTwoOrderDetail.Code)
	assert.Contains(t, customerTwoOrderDetail.Body.String(), `"message":"Forbidden"`)

	customerTwoInvoice := performJSONRequest(t, router, http.MethodGet, "/api/orders/"+strconv.Itoa(orderID)+"/invoice", nil, customerTwoToken)
	require.Equal(t, http.StatusForbidden, customerTwoInvoice.Code)
	assert.Contains(t, customerTwoInvoice.Body.String(), `"message":"Forbidden"`)

	customerOneNotifications := performJSONRequest(t, router, http.MethodGet, "/api/notifications?type=ORDER", nil, customerOneToken)
	require.Equal(t, http.StatusOK, customerOneNotifications.Code)
	assert.Contains(t, customerOneNotifications.Body.String(), `"type":"ORDER"`)

	customerTwoNotifications := performJSONRequest(t, router, http.MethodGet, "/api/notifications", nil, customerTwoToken)
	require.Equal(t, http.StatusOK, customerTwoNotifications.Code)
	assert.Contains(t, customerTwoNotifications.Body.String(), `"items":[]`)
}
