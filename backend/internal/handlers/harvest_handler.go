package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	appvalidator "github.com/fiqryomaratala/backend/internal/validator"
	"github.com/gin-gonic/gin"
)

type HarvestHandler struct {
	harvestService services.HarvestService
}

type HarvestRequest struct {
	FishBatchID   uint    `json:"fish_batch_id" validate:"required"`
	HarvestDate   string  `json:"harvest_date" validate:"required"`
	TotalWeight   float64 `json:"total_weight" validate:"gt=0"`
	FishCount     int     `json:"fish_count" validate:"gt=0"`
	AverageWeight float64 `json:"average_weight" validate:"gte=0"`
	Notes         string  `json:"notes"`
}

type HarvestResponse struct {
	ID            uint                      `json:"id"`
	FishBatchID   uint                      `json:"fish_batch_id"`
	HarvestDate   string                    `json:"harvest_date"`
	TotalWeight   float64                   `json:"total_weight"`
	FishCount     int                       `json:"fish_count"`
	AverageWeight float64                   `json:"average_weight"`
	Notes         string                    `json:"notes"`
	FishBatch     *FishBatchSummaryResponse `json:"fish_batch,omitempty"`
}

func NewHarvestHandler(harvestService services.HarvestService) *HarvestHandler {
	return &HarvestHandler{harvestService: harvestService}
}

// Create godoc
// @Summary Create harvest
// @Description Create a harvest record for a fish batch
// @Tags Harvest
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body HarvestRequest true "Harvest payload"
// @Success 201 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /harvests [post]
func (h *HarvestHandler) Create(c *gin.Context) {
	input, validationErrors := parseHarvestRequest(c)
	if validationErrors != nil {
		utils.ValidationError(c, validationErrors)
		return
	}
	input.Audit = auditContextFromGin(c)

	harvest, err := h.harvestService.Create(*input)
	if err != nil {
		if errors.Is(err, services.ErrFishBatchNotFound) {
			utils.Error(c, http.StatusBadRequest, "Fish batch not found")
			return
		}

		middleware.HandleError(c, err)
		return
	}

	utils.Created(c, "Harvest created successfully", toHarvestResponse(harvest, true))
}

// GetAll godoc
// @Summary Get all harvests
// @Description Get harvest list with filters and pagination
// @Tags Harvest
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Param fish_batch_id query int false "Fish batch ID"
// @Param start_date query string false "Start date (YYYY-MM-DD)"
// @Param end_date query string false "End date (YYYY-MM-DD)"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /harvests [get]
func (h *HarvestHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	params, err := parseHarvestFilters(c)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := h.harvestService.GetAll(services.HarvestListParams{
		FishBatchID: params.FishBatchID,
		StartDate:   params.StartDate,
		EndDate:     params.EndDate,
		Page:        page,
		Limit:       limit,
	})
	if err != nil {
		middleware.HandleError(c, err)
		return
	}

	items := make([]HarvestResponse, 0, len(result.Harvests))
	for _, harvest := range result.Harvests {
		items = append(items, toHarvestResponse(&harvest, true))
	}

	utils.Success(c, "Harvests fetched successfully", gin.H{
		"items": items,
		"meta": gin.H{
			"page":  result.Page,
			"limit": result.Limit,
			"total": result.Total,
		},
	})
}

// GetByID godoc
// @Summary Get harvest detail
// @Description Get harvest detail by ID
// @Tags Harvest
// @Produce json
// @Security BearerAuth
// @Param id path int true "Harvest ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /harvests/{id} [get]
func (h *HarvestHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid harvest ID")
		return
	}

	harvest, err := h.harvestService.GetByID(uint(id))
	if err != nil {
		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Harvest fetched successfully", toHarvestResponse(harvest, true))
}

// Update godoc
// @Summary Update harvest
// @Description Update harvest by ID
// @Tags Harvest
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Harvest ID"
// @Param request body HarvestRequest true "Harvest payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /harvests/{id} [put]
func (h *HarvestHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid harvest ID")
		return
	}

	input, validationErrors := parseHarvestRequest(c)
	if validationErrors != nil {
		utils.ValidationError(c, validationErrors)
		return
	}

	harvest, err := h.harvestService.Update(uint(id), *input)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrHarvestNotFound):
			middleware.HandleError(c, err)
		case errors.Is(err, services.ErrFishBatchNotFound):
			utils.Error(c, http.StatusBadRequest, "Fish batch not found")
		default:
			middleware.HandleError(c, err)
		}
		return
	}

	utils.Success(c, "Harvest updated successfully", toHarvestResponse(harvest, true))
}

// Delete godoc
// @Summary Delete harvest
// @Description Delete harvest by ID
// @Tags Harvest
// @Produce json
// @Security BearerAuth
// @Param id path int true "Harvest ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /harvests/{id} [delete]
func (h *HarvestHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid harvest ID")
		return
	}

	if err := h.harvestService.Delete(uint(id)); err != nil {
		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Harvest deleted successfully", nil)
}

// Summary godoc
// @Summary Get harvest summary
// @Description Get aggregate summary of harvest data
// @Tags Harvest
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /harvests/summary [get]
func (h *HarvestHandler) Summary(c *gin.Context) {
	summary, err := h.harvestService.GetSummary()
	if err != nil {
		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Harvest summary fetched successfully", summary)
}

func parseHarvestRequest(c *gin.Context) (*services.SaveHarvestInput, interface{}) {
	var req HarvestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, appvalidator.FieldError("error", "invalid request body")
	}
	if err := appvalidator.ValidateStruct(req); err != nil {
		return nil, appvalidator.FormatValidationErrors(err)
	}

	harvestDate, err := time.Parse(dateLayout, strings.TrimSpace(req.HarvestDate))
	if err != nil {
		return nil, appvalidator.FieldError("harvest_date", "harvest_date must use format YYYY-MM-DD")
	}

	return &services.SaveHarvestInput{
		FishBatchID:   req.FishBatchID,
		HarvestDate:   harvestDate,
		TotalWeight:   req.TotalWeight,
		FishCount:     req.FishCount,
		AverageWeight: req.AverageWeight,
		Notes:         strings.TrimSpace(req.Notes),
	}, nil
}

type harvestFilters struct {
	FishBatchID uint
	StartDate   *time.Time
	EndDate     *time.Time
}

func parseHarvestFilters(c *gin.Context) (*harvestFilters, error) {
	filters := &harvestFilters{
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

func toHarvestResponse(harvest *models.Harvest, includeBatch bool) HarvestResponse {
	response := HarvestResponse{
		ID:            harvest.ID,
		FishBatchID:   harvest.FishBatchID,
		HarvestDate:   harvest.HarvestDate.Format(dateLayout),
		TotalWeight:   harvest.TotalWeight,
		FishCount:     harvest.FishCount,
		AverageWeight: harvest.AverageWeight,
		Notes:         harvest.Notes,
	}

	if includeBatch && harvest.FishBatch.ID != 0 {
		response.FishBatch = &FishBatchSummaryResponse{
			ID:              harvest.FishBatch.ID,
			BatchCode:       harvest.FishBatch.BatchCode,
			FishType:        harvest.FishBatch.FishType,
			Status:          harvest.FishBatch.Status,
			CurrentCount:    harvest.FishBatch.CurrentCount,
			ExpectedHarvest: harvest.FishBatch.ExpectedHarvest.Format(dateLayout),
		}
	}

	return response
}
