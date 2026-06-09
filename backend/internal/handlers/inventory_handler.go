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

// GetAll godoc
// @Summary Get inventory list
// @Description Get paginated inventory data with optional filters
// @Tags Inventory
// @Produce json
// @Security BearerAuth
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Param product_id query int false "Product ID"
// @Param batch_id query int false "Fish batch ID"
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /inventory [get]
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

// GetByID godoc
// @Summary Get inventory detail
// @Description Get inventory detail by ID
// @Tags Inventory
// @Produce json
// @Security BearerAuth
// @Param id path int true "Inventory ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /inventory/{id} [get]
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

// GetTransactions godoc
// @Summary Get inventory transactions
// @Description Get inventory transaction list filtered by type
// @Tags Inventory
// @Produce json
// @Security BearerAuth
// @Param type query string false "Transaction type"
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /inventory/transactions [get]
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

// Adjust godoc
// @Summary Adjust inventory
// @Description Create a manual inventory adjustment transaction
// @Tags Inventory
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body InventoryAdjustmentRequest true "Inventory adjustment payload"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /inventory/adjustment [post]
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
