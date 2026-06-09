package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type PondHandler struct {
	pondService services.PondService
}

type PondRequest struct {
	Name        string  `json:"name"`
	Location    string  `json:"location"`
	Capacity    int     `json:"capacity"`
	Area        float64 `json:"area"`
	WaterType   string  `json:"water_type"`
	Description string  `json:"description"`
}

type PondResponse struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Location    string  `json:"location"`
	Capacity    int     `json:"capacity"`
	Area        float64 `json:"area"`
	WaterType   string  `json:"water_type"`
	Status      string  `json:"status"`
	Description string  `json:"description"`
}

func NewPondHandler(pondService services.PondService) *PondHandler {
	return &PondHandler{pondService: pondService}
}

func (h *PondHandler) Create(c *gin.Context) {
	input, err := parsePondRequest(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}
	input.Audit = auditContextFromGin(c)

	pond, err := h.pondService.Create(*input)
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to create pond")
		return
	}

	SuccessResponse(c, http.StatusCreated, "Pond created successfully", toPondResponse(pond))
}

func (h *PondHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	result, err := h.pondService.GetAll(services.PondListParams{
		Search: c.Query("search"),
		Page:   page,
		Limit:  limit,
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch ponds")
		return
	}

	ponds := make([]PondResponse, 0, len(result.Ponds))
	for _, pond := range result.Ponds {
		ponds = append(ponds, toPondResponse(&pond))
	}

	SuccessResponse(c, http.StatusOK, "Ponds fetched successfully", gin.H{
		"items": ponds,
		"meta": gin.H{
			"page":  result.Page,
			"limit": result.Limit,
			"total": result.Total,
		},
	})
}

func (h *PondHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid pond ID")
		return
	}

	pond, err := h.pondService.GetByID(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrPondNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Pond not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch pond")
		return
	}

	SuccessResponse(c, http.StatusOK, "Pond fetched successfully", toPondResponse(pond))
}

func (h *PondHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid pond ID")
		return
	}

	input, err := parsePondRequest(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	pond, err := h.pondService.Update(uint(id), *input)
	if err != nil {
		if errors.Is(err, services.ErrPondNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Pond not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to update pond")
		return
	}

	SuccessResponse(c, http.StatusOK, "Pond updated successfully", toPondResponse(pond))
}

func (h *PondHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid pond ID")
		return
	}

	if err := h.pondService.Delete(uint(id)); err != nil {
		if errors.Is(err, services.ErrPondNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Pond not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to delete pond")
		return
	}

	SuccessResponse(c, http.StatusOK, "Pond deleted successfully", nil)
}

func parsePondRequest(c *gin.Context) (*services.SavePondInput, error) {
	var req PondRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		return nil, errors.New("Validation failed")
	}

	name := strings.TrimSpace(req.Name)
	if name == "" {
		return nil, errors.New("Name is required")
	}
	if req.Capacity < 0 {
		return nil, errors.New("Capacity must be greater than or equal to 0")
	}
	if req.Area < 0 {
		return nil, errors.New("Area must be greater than or equal to 0")
	}

	return &services.SavePondInput{
		Name:        name,
		Location:    req.Location,
		Capacity:    req.Capacity,
		Area:        req.Area,
		WaterType:   req.WaterType,
		Description: req.Description,
	}, nil
}

func toPondResponse(pond *models.Pond) PondResponse {
	return PondResponse{
		ID:          pond.ID,
		Name:        pond.Name,
		Location:    pond.Location,
		Capacity:    pond.Capacity,
		Area:        pond.Area,
		WaterType:   pond.WaterType,
		Status:      pond.Status,
		Description: pond.Description,
	}
}
