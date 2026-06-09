package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	"github.com/gin-gonic/gin"
)

const dateLayout = "2006-01-02"

type FishBatchHandler struct {
	batchService services.FishBatchService
}

type CreateFishBatchRequest struct {
	PondID          uint    `json:"pond_id"`
	FishType        string  `json:"fish_type"`
	SeedCount       int     `json:"seed_count"`
	AverageWeight   float64 `json:"average_weight"`
	StartDate       string  `json:"start_date"`
	ExpectedHarvest string  `json:"expected_harvest"`
}

type UpdateFishBatchRequest struct {
	PondID          uint    `json:"pond_id"`
	FishType        string  `json:"fish_type"`
	SeedCount       int     `json:"seed_count"`
	CurrentCount    int     `json:"current_count"`
	AverageWeight   float64 `json:"average_weight"`
	StartDate       string  `json:"start_date"`
	ExpectedHarvest string  `json:"expected_harvest"`
	Status          string  `json:"status"`
}

type PondSummaryResponse struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Location string `json:"location"`
	Status   string `json:"status"`
}

type FishBatchResponse struct {
	ID              uint                 `json:"id"`
	BatchCode       string               `json:"batch_code"`
	PondID          uint                 `json:"pond_id"`
	FishType        string               `json:"fish_type"`
	SeedCount       int                  `json:"seed_count"`
	CurrentCount    int                  `json:"current_count"`
	AverageWeight   float64              `json:"average_weight"`
	StartDate       string               `json:"start_date"`
	ExpectedHarvest string               `json:"expected_harvest"`
	Status          string               `json:"status"`
	Pond            *PondSummaryResponse `json:"pond,omitempty"`
}

func NewFishBatchHandler(batchService services.FishBatchService) *FishBatchHandler {
	return &FishBatchHandler{batchService: batchService}
}

// Create godoc
// @Summary Create fish batch
// @Description Create a new fish cultivation batch
// @Tags Fish Batch
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body CreateFishBatchRequest true "Fish batch payload"
// @Success 201 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /batches [post]
func (h *FishBatchHandler) Create(c *gin.Context) {
	var req CreateFishBatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, nil)
		return
	}

	input, err := validateCreateFishBatchRequest(req)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}
	input.Audit = auditContextFromGin(c)

	batch, err := h.batchService.Create(*input)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrPondNotFound):
			utils.Error(c, http.StatusBadRequest, "Pond not found")
		case errors.Is(err, services.ErrPondInactive):
			utils.Error(c, http.StatusBadRequest, "Pond is not active")
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Created(c, "Fish batch created successfully", toFishBatchResponse(batch, true))
}

// GetAll godoc
// @Summary Get all fish batches
// @Description Get fish batch list with filters and pagination
// @Tags Fish Batch
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Param fish_type query string false "Fish type"
// @Param pond_id query int false "Pond ID"
// @Param status query string false "Batch status"
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /batches [get]
func (h *FishBatchHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)
	pondID := parseUintQuery(c.Query("pond_id"))

	result, err := h.batchService.GetAll(services.FishBatchListParams{
		PondID:   pondID,
		FishType: c.Query("fish_type"),
		Status:   c.Query("status"),
		Page:     page,
		Limit:    limit,
	})
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	items := make([]FishBatchResponse, 0, len(result.Batches))
	for _, batch := range result.Batches {
		items = append(items, toFishBatchResponse(&batch, true))
	}

	utils.Success(c, "Fish batches fetched successfully", gin.H{
		"items": items,
		"meta": gin.H{
			"page":  result.Page,
			"limit": result.Limit,
			"total": result.Total,
		},
	})
}

// GetByID godoc
// @Summary Get fish batch detail
// @Description Get fish batch detail by ID
// @Tags Fish Batch
// @Produce json
// @Security BearerAuth
// @Param id path int true "Fish batch ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /batches/{id} [get]
func (h *FishBatchHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid fish batch ID")
		return
	}

	batch, err := h.batchService.GetByID(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrFishBatchNotFound) {
			utils.NotFound(c, "Fish batch not found")
			return
		}

		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "Fish batch fetched successfully", toFishBatchResponse(batch, true))
}

// Update godoc
// @Summary Update fish batch
// @Description Update fish batch by ID
// @Tags Fish Batch
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Fish batch ID"
// @Param request body UpdateFishBatchRequest true "Fish batch payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /batches/{id} [put]
func (h *FishBatchHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid fish batch ID")
		return
	}

	var req UpdateFishBatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, nil)
		return
	}

	input, err := validateUpdateFishBatchRequest(req)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	batch, err := h.batchService.Update(uint(id), *input)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrFishBatchNotFound):
			utils.NotFound(c, "Fish batch not found")
		case errors.Is(err, services.ErrPondNotFound):
			utils.Error(c, http.StatusBadRequest, "Pond not found")
		case errors.Is(err, services.ErrPondInactive):
			utils.Error(c, http.StatusBadRequest, "Pond is not active")
		default:
			utils.InternalServerError(c)
		}
		return
	}

	utils.Success(c, "Fish batch updated successfully", toFishBatchResponse(batch, true))
}

// Delete godoc
// @Summary Delete fish batch
// @Description Delete fish batch by ID
// @Tags Fish Batch
// @Produce json
// @Security BearerAuth
// @Param id path int true "Fish batch ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /batches/{id} [delete]
func (h *FishBatchHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid fish batch ID")
		return
	}

	if err := h.batchService.Delete(uint(id)); err != nil {
		if errors.Is(err, services.ErrFishBatchNotFound) {
			utils.NotFound(c, "Fish batch not found")
			return
		}

		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "Fish batch deleted successfully", nil)
}

func validateCreateFishBatchRequest(req CreateFishBatchRequest) (*services.CreateFishBatchInput, error) {
	startDate, expectedHarvest, err := validateFishBatchCore(
		req.PondID,
		req.FishType,
		req.SeedCount,
		req.AverageWeight,
		req.StartDate,
		req.ExpectedHarvest,
	)
	if err != nil {
		return nil, err
	}

	return &services.CreateFishBatchInput{
		PondID:          req.PondID,
		FishType:        strings.TrimSpace(req.FishType),
		SeedCount:       req.SeedCount,
		AverageWeight:   req.AverageWeight,
		StartDate:       startDate,
		ExpectedHarvest: expectedHarvest,
	}, nil
}

func validateUpdateFishBatchRequest(req UpdateFishBatchRequest) (*services.UpdateFishBatchInput, error) {
	startDate, expectedHarvest, err := validateFishBatchCore(
		req.PondID,
		req.FishType,
		req.SeedCount,
		req.AverageWeight,
		req.StartDate,
		req.ExpectedHarvest,
	)
	if err != nil {
		return nil, err
	}
	if req.CurrentCount < 0 {
		return nil, errors.New("Current count must be greater than or equal to 0")
	}
	status := strings.TrimSpace(req.Status)
	if status == "" {
		return nil, errors.New("Status is required")
	}

	return &services.UpdateFishBatchInput{
		PondID:          req.PondID,
		FishType:        strings.TrimSpace(req.FishType),
		SeedCount:       req.SeedCount,
		CurrentCount:    req.CurrentCount,
		AverageWeight:   req.AverageWeight,
		StartDate:       startDate,
		ExpectedHarvest: expectedHarvest,
		Status:          status,
	}, nil
}

func validateFishBatchCore(pondID uint, fishType string, seedCount int, averageWeight float64, startDateValue, expectedHarvestValue string) (time.Time, time.Time, error) {
	if pondID == 0 {
		return time.Time{}, time.Time{}, errors.New("Pond ID is required")
	}
	if strings.TrimSpace(fishType) == "" {
		return time.Time{}, time.Time{}, errors.New("Fish type is required")
	}
	if seedCount < 0 {
		return time.Time{}, time.Time{}, errors.New("Seed count must be greater than or equal to 0")
	}
	if averageWeight < 0 {
		return time.Time{}, time.Time{}, errors.New("Average weight must be greater than or equal to 0")
	}

	startDate, err := time.Parse(dateLayout, strings.TrimSpace(startDateValue))
	if err != nil {
		return time.Time{}, time.Time{}, errors.New("Start date must use format YYYY-MM-DD")
	}

	expectedHarvest, err := time.Parse(dateLayout, strings.TrimSpace(expectedHarvestValue))
	if err != nil {
		return time.Time{}, time.Time{}, errors.New("Expected harvest must use format YYYY-MM-DD")
	}

	return startDate, expectedHarvest, nil
}

func parseUintQuery(value string) uint {
	parsed, err := strconv.ParseUint(strings.TrimSpace(value), 10, 64)
	if err != nil {
		return 0
	}

	return uint(parsed)
}

func toFishBatchResponse(batch *models.FishBatch, includePond bool) FishBatchResponse {
	response := FishBatchResponse{
		ID:              batch.ID,
		BatchCode:       batch.BatchCode,
		PondID:          batch.PondID,
		FishType:        batch.FishType,
		SeedCount:       batch.SeedCount,
		CurrentCount:    batch.CurrentCount,
		AverageWeight:   batch.AverageWeight,
		StartDate:       batch.StartDate.Format(dateLayout),
		ExpectedHarvest: batch.ExpectedHarvest.Format(dateLayout),
		Status:          batch.Status,
	}

	if includePond {
		if batch.Pond.ID != 0 {
			response.Pond = &PondSummaryResponse{
				ID:       batch.Pond.ID,
				Name:     batch.Pond.Name,
				Location: batch.Pond.Location,
				Status:   batch.Pond.Status,
			}
		}
	}

	return response
}
