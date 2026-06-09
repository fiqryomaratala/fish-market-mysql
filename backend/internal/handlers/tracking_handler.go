package handlers

import (
	"errors"
	"net/http"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type TrackingHandler struct {
	trackingService services.TrackingService
}

type TrackingResponse struct {
	BatchCode   string                    `json:"batch_code"`
	FishType    string                    `json:"fish_type"`
	Status      string                    `json:"status"`
	Pond        TrackingPondResponse      `json:"pond"`
	Batch       TrackingBatchInfoResponse `json:"batch"`
	FeedingLogs []TrackingFeedingResponse `json:"feeding_logs"`
	Harvests    []TrackingHarvestResponse `json:"harvests"`
}

type TrackingPondResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Location string `json:"location"`
}

type TrackingBatchInfoResponse struct {
	SeedCount       int     `json:"seed_count"`
	CurrentCount    int     `json:"current_count"`
	AverageWeight   float64 `json:"average_weight"`
	StartDate       string  `json:"start_date"`
	ExpectedHarvest string  `json:"expected_harvest"`
}

type TrackingFeedingResponse struct {
	FeedType   string  `json:"feed_type"`
	FeedAmount float64 `json:"feed_amount"`
	FeedTime   string  `json:"feed_time"`
}

type TrackingHarvestResponse struct {
	HarvestDate string  `json:"harvest_date"`
	TotalWeight float64 `json:"total_weight"`
	FishCount   int     `json:"fish_count"`
}

func NewTrackingHandler(trackingService services.TrackingService) *TrackingHandler {
	return &TrackingHandler{trackingService: trackingService}
}

// GetByBatchCode godoc
// @Summary Track fish batch
// @Description Get public fish batch traceability data by batch code
// @Tags Tracking
// @Produce json
// @Param batchCode path string true "Batch code"
// @Success 200 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /tracking/{batchCode} [get]
func (h *TrackingHandler) GetByBatchCode(c *gin.Context) {
	batchCode := c.Param("batchCode")

	batch, err := h.trackingService.GetByBatchCode(batchCode)
	if err != nil {
		if errors.Is(err, services.ErrFishBatchNotFound) {
			utils.ErrorResponse(c, http.StatusNotFound, "Batch not found")
			return
		}

		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch batch tracking")
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "", toTrackingResponse(batch))
}

func toTrackingResponse(batch *models.FishBatch) TrackingResponse {
	feedingLogs := make([]TrackingFeedingResponse, 0, len(batch.FeedingLogs))
	for _, log := range batch.FeedingLogs {
		feedingLogs = append(feedingLogs, TrackingFeedingResponse{
			FeedType:   log.FeedType,
			FeedAmount: log.FeedAmount,
			FeedTime:   log.FeedTime.Format(time.RFC3339),
		})
	}

	harvests := make([]TrackingHarvestResponse, 0, len(batch.Harvests))
	for _, harvest := range batch.Harvests {
		harvests = append(harvests, TrackingHarvestResponse{
			HarvestDate: harvest.HarvestDate.Format(dateLayout),
			TotalWeight: harvest.TotalWeight,
			FishCount:   harvest.FishCount,
		})
	}

	return TrackingResponse{
		BatchCode: batch.BatchCode,
		FishType:  batch.FishType,
		Status:    batch.Status,
		Pond: TrackingPondResponse{
			ID:       batch.Pond.ID,
			Name:     batch.Pond.Name,
			Location: batch.Pond.Location,
		},
		Batch: TrackingBatchInfoResponse{
			SeedCount:       batch.SeedCount,
			CurrentCount:    batch.CurrentCount,
			AverageWeight:   batch.AverageWeight,
			StartDate:       batch.StartDate.Format(dateLayout),
			ExpectedHarvest: batch.ExpectedHarvest.Format(dateLayout),
		},
		FeedingLogs: feedingLogs,
		Harvests:    harvests,
	}
}
