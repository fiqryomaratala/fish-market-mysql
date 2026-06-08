package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type FeedingLogHandler struct {
	logService services.FeedingLogService
}

type FeedingLogRequest struct {
	FishBatchID uint    `json:"fish_batch_id"`
	FeedType    string  `json:"feed_type"`
	FeedAmount  float64 `json:"feed_amount"`
	FeedTime    string  `json:"feed_time"`
	Notes       string  `json:"notes"`
}

type FishBatchSummaryResponse struct {
	ID              uint   `json:"id"`
	BatchCode       string `json:"batch_code"`
	FishType        string `json:"fish_type"`
	Status          string `json:"status"`
	CurrentCount    int    `json:"current_count"`
	ExpectedHarvest string `json:"expected_harvest"`
}

type FeedingLogResponse struct {
	ID          uint                      `json:"id"`
	FishBatchID uint                      `json:"fish_batch_id"`
	FeedType    string                    `json:"feed_type"`
	FeedAmount  float64                   `json:"feed_amount"`
	FeedTime    string                    `json:"feed_time"`
	Notes       string                    `json:"notes"`
	FishBatch   *FishBatchSummaryResponse `json:"fish_batch,omitempty"`
}

func NewFeedingLogHandler(logService services.FeedingLogService) *FeedingLogHandler {
	return &FeedingLogHandler{logService: logService}
}

func (h *FeedingLogHandler) Create(c *gin.Context) {
	input, err := parseFeedingLogRequest(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	log, err := h.logService.Create(*input)
	if err != nil {
		if errors.Is(err, services.ErrFishBatchNotFound) {
			ErrorResponse(c, http.StatusBadRequest, "Fish batch not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to create feeding log")
		return
	}

	SuccessResponse(c, http.StatusCreated, "Feeding log created successfully", toFeedingLogResponse(log, true))
}

func (h *FeedingLogHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	params, err := parseFeedingLogFilters(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.logService.GetAll(services.FeedingLogListParams{
		FishBatchID: params.FishBatchID,
		StartDate:   params.StartDate,
		EndDate:     params.EndDate,
		Page:        page,
		Limit:       limit,
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch feeding logs")
		return
	}

	items := make([]FeedingLogResponse, 0, len(result.Logs))
	for _, log := range result.Logs {
		items = append(items, toFeedingLogResponse(&log, true))
	}

	SuccessResponse(c, http.StatusOK, "Feeding logs fetched successfully", gin.H{
		"items": items,
		"meta": gin.H{
			"page":  result.Page,
			"limit": result.Limit,
			"total": result.Total,
		},
	})
}

func (h *FeedingLogHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid feeding log ID")
		return
	}

	log, err := h.logService.GetByID(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrFeedingLogNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Feeding log not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch feeding log")
		return
	}

	SuccessResponse(c, http.StatusOK, "Feeding log fetched successfully", toFeedingLogResponse(log, true))
}

func (h *FeedingLogHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid feeding log ID")
		return
	}

	input, err := parseFeedingLogRequest(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	log, err := h.logService.Update(uint(id), *input)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrFeedingLogNotFound):
			ErrorResponse(c, http.StatusNotFound, "Feeding log not found")
		case errors.Is(err, services.ErrFishBatchNotFound):
			ErrorResponse(c, http.StatusBadRequest, "Fish batch not found")
		default:
			ErrorResponse(c, http.StatusInternalServerError, "Failed to update feeding log")
		}
		return
	}

	SuccessResponse(c, http.StatusOK, "Feeding log updated successfully", toFeedingLogResponse(log, true))
}

func (h *FeedingLogHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid feeding log ID")
		return
	}

	if err := h.logService.Delete(uint(id)); err != nil {
		if errors.Is(err, services.ErrFeedingLogNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Feeding log not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to delete feeding log")
		return
	}

	SuccessResponse(c, http.StatusOK, "Feeding log deleted successfully", nil)
}

func parseFeedingLogRequest(c *gin.Context) (*services.SaveFeedingLogInput, error) {
	var req FeedingLogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errors.New("Validation failed")
	}

	if req.FishBatchID == 0 {
		return nil, errors.New("Fish batch ID is required")
	}

	feedType := strings.TrimSpace(req.FeedType)
	if feedType == "" {
		return nil, errors.New("Feed type is required")
	}

	if req.FeedAmount <= 0 {
		return nil, errors.New("Feed amount must be greater than 0")
	}

	feedTime, err := time.Parse(time.RFC3339, strings.TrimSpace(req.FeedTime))
	if err != nil {
		return nil, errors.New("Feed time must use RFC3339 format")
	}

	return &services.SaveFeedingLogInput{
		FishBatchID: req.FishBatchID,
		FeedType:    feedType,
		FeedAmount:  req.FeedAmount,
		FeedTime:    feedTime,
		Notes:       strings.TrimSpace(req.Notes),
	}, nil
}

type feedingLogFilters struct {
	FishBatchID uint
	StartDate   *time.Time
	EndDate     *time.Time
}

func parseFeedingLogFilters(c *gin.Context) (*feedingLogFilters, error) {
	filters := &feedingLogFilters{
		FishBatchID: parseUintQuery(c.Query("fish_batch_id")),
	}

	startDateValue := strings.TrimSpace(c.Query("start_date"))
	if startDateValue != "" {
		startDate, err := time.Parse(dateLayout, startDateValue)
		if err != nil {
			return nil, errors.New("Start date must use format YYYY-MM-DD")
		}
		filters.StartDate = &startDate
	}

	endDateValue := strings.TrimSpace(c.Query("end_date"))
	if endDateValue != "" {
		endDate, err := time.Parse(dateLayout, endDateValue)
		if err != nil {
			return nil, errors.New("End date must use format YYYY-MM-DD")
		}
		endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
		filters.EndDate = &endDate
	}

	return filters, nil
}

func toFeedingLogResponse(log *models.FeedingLog, includeBatch bool) FeedingLogResponse {
	response := FeedingLogResponse{
		ID:          log.ID,
		FishBatchID: log.FishBatchID,
		FeedType:    log.FeedType,
		FeedAmount:  log.FeedAmount,
		FeedTime:    log.FeedTime.Format(time.RFC3339),
		Notes:       log.Notes,
	}

	if includeBatch && log.FishBatch.ID != 0 {
		response.FishBatch = &FishBatchSummaryResponse{
			ID:              log.FishBatch.ID,
			BatchCode:       log.FishBatch.BatchCode,
			FishType:        log.FishBatch.FishType,
			Status:          log.FishBatch.Status,
			CurrentCount:    log.FishBatch.CurrentCount,
			ExpectedHarvest: log.FishBatch.ExpectedHarvest.Format(dateLayout),
		}
	}

	return response
}
