package repositories

import (
	"errors"
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type InventoryFilter struct {
	Page      int
	Limit     int
	ProductID uint
	BatchID   uint
}

type InventoryTransactionFilter struct {
	Type string
}

type InventoryRepository interface {
	Create(inventory *models.Inventory) error
	FindAll(filter InventoryFilter) ([]models.Inventory, int64, error)
	FindByID(id uint) (*models.Inventory, error)
	FindByProductAndBatch(productID, batchID uint) (*models.Inventory, error)
	FindAvailableByProduct(productID uint) ([]models.Inventory, error)
	GetTotalAvailableByProduct(productID uint) (float64, error)
	Update(inventory *models.Inventory) error
}

type InventoryTransactionRepository interface {
	Create(transaction *models.InventoryTransaction) error
	FindAll(filter InventoryTransactionFilter) ([]models.InventoryTransaction, error)
}

type inventoryRepository struct {
	db *gorm.DB
}

type inventoryTransactionRepository struct {
	db *gorm.DB
}

func NewInventoryRepository(db *gorm.DB) InventoryRepository {
	return &inventoryRepository{db: db}
}

func NewInventoryTransactionRepository(db *gorm.DB) InventoryTransactionRepository {
	return &inventoryTransactionRepository{db: db}
}

func (r *inventoryRepository) Create(inventory *models.Inventory) error {
	return r.db.Create(inventory).Error
}

func (r *inventoryRepository) FindAll(filter InventoryFilter) ([]models.Inventory, int64, error) {
	var (
		items []models.Inventory
		total int64
	)

	query := r.db.Model(&models.Inventory{}).Preload("Product").Preload("FishBatch")
	if filter.ProductID > 0 {
		query = query.Where("product_id = ?", filter.ProductID)
	}
	if filter.BatchID > 0 {
		query = query.Where("fish_batch_id = ?", filter.BatchID)
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(filter.Limit).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *inventoryRepository) FindByID(id uint) (*models.Inventory, error) {
	var inventory models.Inventory
	err := r.db.Preload("Product").Preload("FishBatch").First(&inventory, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &inventory, nil
}

func (r *inventoryRepository) FindByProductAndBatch(productID, batchID uint) (*models.Inventory, error) {
	var inventory models.Inventory
	err := r.db.Where("product_id = ? AND fish_batch_id = ?", productID, batchID).First(&inventory).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &inventory, nil
}

func (r *inventoryRepository) FindAvailableByProduct(productID uint) ([]models.Inventory, error) {
	var items []models.Inventory
	err := r.db.
		Where("product_id = ? AND quantity > 0", productID).
		Order("created_at ASC").
		Find(&items).Error
	return items, err
}

func (r *inventoryRepository) GetTotalAvailableByProduct(productID uint) (float64, error) {
	var total float64
	err := r.db.Model(&models.Inventory{}).
		Where("product_id = ?", productID).
		Select("COALESCE(SUM(quantity), 0)").
		Scan(&total).Error
	return total, err
}

func (r *inventoryRepository) Update(inventory *models.Inventory) error {
	return r.db.Save(inventory).Error
}

func (r *inventoryTransactionRepository) Create(transaction *models.InventoryTransaction) error {
	return r.db.Create(transaction).Error
}

func (r *inventoryTransactionRepository) FindAll(filter InventoryTransactionFilter) ([]models.InventoryTransaction, error) {
	var items []models.InventoryTransaction
	query := r.db.Model(&models.InventoryTransaction{}).Preload("Inventory").Preload("Inventory.Product").Preload("Inventory.FishBatch")
	if strings.TrimSpace(filter.Type) != "" {
		query = query.Where("type = ?", strings.TrimSpace(filter.Type))
	}
	if err := query.Order("created_at DESC").Find(&items).Error; err != nil {
		return nil, err
	}
	return items, nil
}
