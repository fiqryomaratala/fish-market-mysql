package tests

import (
	"encoding/json"
	"net/http"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestIntegrationManagementCRUDFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	_, router := setupObservabilityIntegrationRouter(t)

	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")
	staffToken := loginAndExtractToken(t, router, "staff1@fishmarket.com", "password123")

	pondID := createIntegrationPond(t, router, adminToken, "Kolam CRUD")

	pondUpdateRecorder := performJSONRequest(t, router, http.MethodPut, "/api/ponds/"+strconv.Itoa(int(pondID)), map[string]interface{}{
		"name":        "Kolam CRUD Update",
		"location":    "Blok Barat",
		"capacity":    4200,
		"area":        95,
		"water_type":  "freshwater",
		"description": "Updated pond",
	}, staffToken)
	require.Equal(t, http.StatusOK, pondUpdateRecorder.Code)
	assert.Contains(t, pondUpdateRecorder.Body.String(), `"name":"Kolam CRUD Update"`)

	batchID := createIntegrationBatch(t, router, staffToken, pondID, "Nila")

	batchUpdateRecorder := performJSONRequest(t, router, http.MethodPut, "/api/batches/"+strconv.Itoa(int(batchID)), map[string]interface{}{
		"pond_id":          pondID,
		"fish_type":        "Nila Super",
		"seed_count":       1000,
		"current_count":    960,
		"average_weight":   0.08,
		"start_date":       "2026-08-01",
		"expected_harvest": "2026-12-15",
		"status":           "active",
	}, staffToken)
	require.Equal(t, http.StatusOK, batchUpdateRecorder.Code)
	assert.Contains(t, batchUpdateRecorder.Body.String(), `"fish_type":"Nila Super"`)

	feedingCreateRecorder := performJSONRequest(t, router, http.MethodPost, "/api/feeding-logs", map[string]interface{}{
		"fish_batch_id": batchID,
		"feed_type":     "Pelet PF-1000",
		"feed_amount":   25,
		"feed_time":     "2026-08-15T08:00:00Z",
		"notes":         "Pagi",
	}, staffToken)
	require.Equal(t, http.StatusCreated, feedingCreateRecorder.Code)

	var feedingCreateResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(feedingCreateRecorder.Body.Bytes(), &feedingCreateResponse))
	feedingID := int(feedingCreateResponse.Data.(map[string]interface{})["id"].(float64))

	feedingUpdateRecorder := performJSONRequest(t, router, http.MethodPut, "/api/feeding-logs/"+strconv.Itoa(feedingID), map[string]interface{}{
		"fish_batch_id": batchID,
		"feed_type":     "Pelet PF-2000",
		"feed_amount":   30,
		"feed_time":     "2026-08-15T16:00:00Z",
		"notes":         "Sore",
	}, staffToken)
	require.Equal(t, http.StatusOK, feedingUpdateRecorder.Code)
	assert.Contains(t, feedingUpdateRecorder.Body.String(), `"feed_type":"Pelet PF-2000"`)

	feedingDetailRecorder := performJSONRequest(t, router, http.MethodGet, "/api/feeding-logs/"+strconv.Itoa(feedingID), nil, adminToken)
	require.Equal(t, http.StatusOK, feedingDetailRecorder.Code)
	assert.Contains(t, feedingDetailRecorder.Body.String(), `"notes":"Sore"`)

	feedingDeleteRecorder := performJSONRequest(t, router, http.MethodDelete, "/api/feeding-logs/"+strconv.Itoa(feedingID), nil, adminToken)
	require.Equal(t, http.StatusOK, feedingDeleteRecorder.Code)
	assert.Contains(t, feedingDeleteRecorder.Body.String(), `"message":"Feeding log deleted successfully"`)

	batchDeleteRecorder := performJSONRequest(t, router, http.MethodDelete, "/api/batches/"+strconv.Itoa(int(batchID)), nil, adminToken)
	require.Equal(t, http.StatusOK, batchDeleteRecorder.Code)
	assert.Contains(t, batchDeleteRecorder.Body.String(), `"message":"Fish batch deleted successfully"`)

	pondDeleteRecorder := performJSONRequest(t, router, http.MethodDelete, "/api/ponds/"+strconv.Itoa(int(pondID)), nil, adminToken)
	require.Equal(t, http.StatusOK, pondDeleteRecorder.Code)
	assert.Contains(t, pondDeleteRecorder.Body.String(), `"message":"Pond deleted successfully"`)
}
