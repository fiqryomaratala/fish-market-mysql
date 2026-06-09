package handlers

import (
	"errors"
	"net/http"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type InventoryHandler struct {
	inventoryService services.InventoryService
}

type InventoryAdjustmentRequest struct {
	InventoryID uint    `json:"inventory_id"`
	Quantity    float64 `json:"quantity"`
	Description string  `json:"description"`
}

func NewInventoryHandler(inventoryService services.InventoryService) *InventoryHandler {
	return &InventoryHandler{inventoryService: inventoryService}
}

func (h *InventoryHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	items, meta, err := h.inventoryService.GetAll(services.InventoryListParams{
		Page:      page,
		Limit:     limit,
		ProductID: parseUintQuery(c.Query("product_id")),
		BatchID:   parseUintQuery(c.Query("batch_id")),
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch inventory")
		return
	}

	SuccessResponse(c, http.StatusOK, "", gin.H{
		"items": items,
		"meta":  meta,
	})
}

func (h *InventoryHandler) GetByID(c *gin.Context) {
	id := parseUintQuery(c.Param("id"))
	if id == 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid inventory ID")
		return
	}

	item, err := h.inventoryService.GetByID(id)
	if err != nil {
		if errors.Is(err, services.ErrInventoryNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Inventory not found")
			return
		}
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch inventory")
		return
	}

	SuccessResponse(c, http.StatusOK, "", item)
}

func (h *InventoryHandler) GetTransactions(c *gin.Context) {
	items, err := h.inventoryService.GetTransactions(services.InventoryTransactionListParams{
		Type: c.Query("type"),
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch inventory transactions")
		return
	}

	SuccessResponse(c, http.StatusOK, "", items)
}

func (h *InventoryHandler) Adjust(c *gin.Context) {
	var req InventoryAdjustmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Validation failed")
		return
	}
	if req.InventoryID == 0 {
		ErrorResponse(c, http.StatusBadRequest, "Inventory ID is required")
		return
	}

	item, err := h.inventoryService.Adjust(services.InventoryAdjustmentInput{
		InventoryID: req.InventoryID,
		Quantity:    req.Quantity,
		Description: req.Description,
		Reference:   "MANUAL-ADJUSTMENT",
		Audit:       auditContextFromGin(c),
	})
	if err != nil {
		if errors.Is(err, services.ErrInventoryNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Inventory not found")
			return
		}
		ErrorResponse(c, http.StatusInternalServerError, "Failed to adjust inventory")
		return
	}

	SuccessResponse(c, http.StatusOK, "Inventory adjusted successfully", item)
}
