package services

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
)

var ErrInventoryNotFound = errors.New("inventory not found")

type InventoryListParams struct {
	Page      int
	Limit     int
	ProductID uint
	BatchID   uint
}

type InventoryTransactionListParams struct {
	Type string
}

type InventoryAdjustmentInput struct {
	InventoryID uint
	Quantity    float64
	Description string
	Reference   string
	Audit       *AuditContext
}

type InventoryService interface {
	GetAll(params InventoryListParams) ([]dto.InventoryItem, map[string]interface{}, error)
	GetByID(id uint) (*dto.InventoryItem, error)
	GetTransactions(params InventoryTransactionListParams) ([]dto.InventoryTransactionItem, error)
	CreateHarvestInventory(batch *models.FishBatch, totalWeight float64) error
	Adjust(input InventoryAdjustmentInput) (*dto.InventoryItem, error)
	DeductProductInventory(productID uint, quantity float64, reference string, description string, audit *AuditContext) error
}

type inventoryService struct {
	inventoryRepo            repositories.InventoryRepository
	inventoryTransactionRepo repositories.InventoryTransactionRepository
	productRepo              repositories.ProductRepository
}

func NewInventoryService(
	inventoryRepo repositories.InventoryRepository,
	inventoryTransactionRepo repositories.InventoryTransactionRepository,
	productRepo repositories.ProductRepository,
) InventoryService {
	return &inventoryService{
		inventoryRepo:            inventoryRepo,
		inventoryTransactionRepo: inventoryTransactionRepo,
		productRepo:              productRepo,
	}
}

func (s *inventoryService) GetAll(params InventoryListParams) ([]dto.InventoryItem, map[string]interface{}, error) {
	items, total, err := s.inventoryRepo.FindAll(repositories.InventoryFilter{
		Page:      params.Page,
		Limit:     params.Limit,
		ProductID: params.ProductID,
		BatchID:   params.BatchID,
	})
	if err != nil {
		return nil, nil, err
	}

	result := make([]dto.InventoryItem, 0, len(items))
	for _, item := range items {
		result = append(result, toInventoryDTO(&item))
	}

	return result, map[string]interface{}{
		"page":  params.Page,
		"limit": params.Limit,
		"total": total,
	}, nil
}

func (s *inventoryService) GetByID(id uint) (*dto.InventoryItem, error) {
	item, err := s.inventoryRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrInventoryNotFound
	}

	result := toInventoryDTO(item)
	return &result, nil
}

func (s *inventoryService) GetTransactions(params InventoryTransactionListParams) ([]dto.InventoryTransactionItem, error) {
	items, err := s.inventoryTransactionRepo.FindAll(repositories.InventoryTransactionFilter{
		Type: strings.TrimSpace(params.Type),
	})
	if err != nil {
		return nil, err
	}

	result := make([]dto.InventoryTransactionItem, 0, len(items))
	for _, item := range items {
		result = append(result, toInventoryTransactionDTO(&item))
	}

	return result, nil
}

func (s *inventoryService) CreateHarvestInventory(batch *models.FishBatch, totalWeight float64) error {
	product, err := s.productRepo.FindByFishType(batch.FishType)
	if err != nil {
		logger.Error("failed to find product by fish type for inventory stock in", err, zap.String("module", "INVENTORY"), zap.String("fish_type", batch.FishType))
		return err
	}
	if product == nil {
		return ErrProductNotFound
	}

	inventory, err := s.inventoryRepo.FindByProductAndBatch(product.ID, batch.ID)
	if err != nil {
		logger.Error("failed to find inventory by product and batch", err, zap.String("module", "INVENTORY"), zap.Uint("product_id", product.ID), zap.Uint("batch_id", batch.ID))
		return err
	}

	if inventory == nil {
		inventory = &models.Inventory{
			ProductID:   product.ID,
			FishBatchID: batch.ID,
			Quantity:    totalWeight,
			Unit:        "kg",
			Status:      "available",
		}
		if err := s.inventoryRepo.Create(inventory); err != nil {
			logger.Error("failed to create inventory stock in", err, zap.String("module", "INVENTORY"), zap.Uint("product_id", product.ID))
			return err
		}
	} else {
		inventory.Quantity += totalWeight
		inventory.Status = "available"
		if err := s.inventoryRepo.Update(inventory); err != nil {
			logger.Error("failed to update inventory stock in", err, zap.String("module", "INVENTORY"), zap.Uint("inventory_id", inventory.ID))
			return err
		}
	}

	if err := s.inventoryTransactionRepo.Create(&models.InventoryTransaction{
		InventoryID: inventory.ID,
		Type:        "IN",
		Quantity:    totalWeight,
		Description: "Harvest Result",
		Reference:   batch.BatchCode,
	}); err != nil {
		logger.Error("failed to create inventory transaction IN", err, zap.String("module", "INVENTORY"), zap.Uint("inventory_id", inventory.ID))
		return err
	}

	logger.Info("inventory stock in recorded", zap.String("module", "INVENTORY"), zap.Uint("inventory_id", inventory.ID), zap.Float64("quantity", totalWeight))
	return nil
}

func (s *inventoryService) Adjust(input InventoryAdjustmentInput) (*dto.InventoryItem, error) {
	item, err := s.inventoryRepo.FindByID(input.InventoryID)
	if err != nil {
		logger.Error("failed to find inventory before adjustment", err, zap.String("module", "INVENTORY"), zap.Uint("inventory_id", input.InventoryID))
		return nil, err
	}
	if item == nil {
		return nil, ErrInventoryNotFound
	}

	item.Quantity += input.Quantity
	if item.Quantity < 0 {
		item.Quantity = 0
	}

	if err := s.inventoryRepo.Update(item); err != nil {
		logger.Error("failed to update inventory adjustment", err, zap.String("module", "INVENTORY"), zap.Uint("inventory_id", item.ID))
		return nil, err
	}

	if err := s.inventoryTransactionRepo.Create(&models.InventoryTransaction{
		InventoryID: item.ID,
		Type:        "ADJUSTMENT",
		Quantity:    input.Quantity,
		Description: strings.TrimSpace(input.Description),
		Reference:   strings.TrimSpace(input.Reference),
	}); err != nil {
		logger.Error("failed to create inventory transaction adjustment", err, zap.String("module", "INVENTORY"), zap.Uint("inventory_id", item.ID))
		return nil, err
	}

	updated, err := s.inventoryRepo.FindByID(item.ID)
	if err != nil {
		return nil, err
	}

	if input.Audit != nil && updated.Quantity <= 5 {
		helpers.CreateNotification(
			input.Audit.UserID,
			"Low Stock",
			fmt.Sprintf("Stok %s tinggal %.2f %s.", updated.Product.Name, updated.Quantity, updated.Unit),
			"INVENTORY",
			"INVENTORY",
			updated.ID,
		)
	}

	result := toInventoryDTO(updated)
	logger.Info("inventory adjusted", zap.String("module", "INVENTORY"), zap.Uint("inventory_id", item.ID), zap.Float64("quantity", input.Quantity))
	return &result, nil
}

func (s *inventoryService) DeductProductInventory(productID uint, quantity float64, reference string, description string, audit *AuditContext) error {
	items, err := s.inventoryRepo.FindAvailableByProduct(productID)
	if err != nil {
		logger.Error("failed to find available inventory for stock out", err, zap.String("module", "INVENTORY"), zap.Uint("product_id", productID))
		return err
	}

	remaining := quantity
	for _, item := range items {
		if remaining <= 0 {
			break
		}

		deducted := remaining
		if item.Quantity < deducted {
			deducted = item.Quantity
		}

		item.Quantity -= deducted
		if item.Quantity == 0 {
			item.Status = "empty"
		}

		if err := s.inventoryRepo.Update(&item); err != nil {
			logger.Error("failed to update inventory during stock out", err, zap.String("module", "INVENTORY"), zap.Uint("inventory_id", item.ID))
			return err
		}

		if err := s.inventoryTransactionRepo.Create(&models.InventoryTransaction{
			InventoryID: item.ID,
			Type:        "OUT",
			Quantity:    deducted,
			Description: strings.TrimSpace(description),
			Reference:   strings.TrimSpace(reference),
		}); err != nil {
			logger.Error("failed to create inventory transaction OUT", err, zap.String("module", "INVENTORY"), zap.Uint("inventory_id", item.ID))
			return err
		}

		if audit != nil && item.Quantity <= 5 {
			helpers.CreateNotification(
				audit.UserID,
				"Low Stock",
				fmt.Sprintf("Stok %s tinggal %.2f %s.", item.Product.Name, item.Quantity, item.Unit),
				"INVENTORY",
				"INVENTORY",
				item.ID,
			)
		}

		remaining -= deducted
	}

	if remaining > 0 {
		logger.Warn("inventory stock out could not be fully deducted", zap.String("module", "INVENTORY"), zap.Uint("product_id", productID), zap.Float64("remaining", remaining))
		return ErrInsufficientInventory
	}

	logger.Info("inventory stock out recorded", zap.String("module", "INVENTORY"), zap.Uint("product_id", productID), zap.Float64("quantity", quantity))
	return nil
}

func toInventoryDTO(item *models.Inventory) dto.InventoryItem {
	return dto.InventoryItem{
		ID:          item.ID,
		ProductID:   item.ProductID,
		Product:     item.Product.Name,
		FishBatchID: item.FishBatchID,
		BatchCode:   item.FishBatch.BatchCode,
		Quantity:    item.Quantity,
		Unit:        item.Unit,
		Status:      item.Status,
	}
}

func toInventoryTransactionDTO(item *models.InventoryTransaction) dto.InventoryTransactionItem {
	return dto.InventoryTransactionItem{
		ID:          item.ID,
		InventoryID: item.InventoryID,
		Type:        item.Type,
		Quantity:    item.Quantity,
		Description: item.Description,
		Reference:   item.Reference,
		Product:     item.Inventory.Product.Name,
		BatchCode:   item.Inventory.FishBatch.BatchCode,
		CreatedAt:   item.CreatedAt.UTC().Format(time.RFC3339),
	}
}
