package tests

import (
	"testing"

	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestInventoryServiceStockIn(t *testing.T) {
	SetupTest(t)

	createdInventory := &models.Inventory{}
	createdTransaction := &models.InventoryTransaction{}
	inventoryRepo := &mocks.MockInventoryRepository{
		FindByProductAndBatchFunc: func(productID, batchID uint) (*models.Inventory, error) {
			return nil, nil
		},
		CreateFunc: func(inventory *models.Inventory) error {
			inventory.ID = 10
			*createdInventory = *inventory
			return nil
		},
	}
	transactionRepo := &mocks.MockInventoryTransactionRepository{
		CreateFunc: func(transaction *models.InventoryTransaction) error {
			*createdTransaction = *transaction
			return nil
		},
	}
	productRepo := &mocks.MockProductRepository{
		FindByFishTypeFunc: func(fishType string) (*models.Product, error) {
			return &models.Product{Model: models.Product{}.Model, Name: "Ikan Nila", FishBatchID: 1}, nil
		},
	}

	service := services.NewInventoryService(inventoryRepo, transactionRepo, productRepo)
	err := service.CreateHarvestInventory(&models.FishBatch{Model: gorm.Model{ID: 2}, BatchCode: "BTCH-2026-0001", FishType: "Nila"}, 100)

	assert.NoError(t, err)
	assert.Equal(t, uint(10), createdInventory.ID)
	assert.Equal(t, float64(100), createdInventory.Quantity)
	assert.Equal(t, "IN", createdTransaction.Type)
	assert.Equal(t, float64(100), createdTransaction.Quantity)
}

func TestInventoryServiceStockOut(t *testing.T) {
	SetupTest(t)

	var updatedItems []models.Inventory
	var transactions []models.InventoryTransaction
	inventoryRepo := &mocks.MockInventoryRepository{
		FindAvailableByProductFunc: func(productID uint) ([]models.Inventory, error) {
			return []models.Inventory{
				{
					Model:     models.Inventory{}.Model,
					ProductID: productID,
					Quantity:  8,
					Unit:      "kg",
					Status:    "available",
					Product:   models.Product{Name: "Nila"},
				},
				{
					Model:     models.Inventory{}.Model,
					ProductID: productID,
					Quantity:  5,
					Unit:      "kg",
					Status:    "available",
					Product:   models.Product{Name: "Nila"},
				},
			}, nil
		},
		UpdateFunc: func(inventory *models.Inventory) error {
			updatedItems = append(updatedItems, *inventory)
			return nil
		},
	}
	transactionRepo := &mocks.MockInventoryTransactionRepository{
		CreateFunc: func(transaction *models.InventoryTransaction) error {
			transactions = append(transactions, *transaction)
			return nil
		},
	}

	service := services.NewInventoryService(inventoryRepo, transactionRepo, &mocks.MockProductRepository{})
	err := service.DeductProductInventory(1, 10, "INV-2026-000001", "Checkout Order", nil)

	assert.NoError(t, err)
	assert.Len(t, updatedItems, 2)
	assert.Len(t, transactions, 2)
	assert.Equal(t, "OUT", transactions[0].Type)
	assert.Equal(t, float64(8), transactions[0].Quantity)
	assert.Equal(t, float64(2), transactions[1].Quantity)
}

func TestInventoryServiceStockAdjustment(t *testing.T) {
	SetupTest(t)

	inventory := &models.Inventory{
		Model:       gorm.Model{ID: 1},
		ProductID:   1,
		FishBatchID: 1,
		Quantity:    10,
		Unit:        "kg",
		Product:     models.Product{Name: "Nila"},
		FishBatch:   models.FishBatch{BatchCode: "BTCH-2026-0001"},
	}
	inventoryRepo := &mocks.MockInventoryRepository{
		FindByIDFunc: func(id uint) (*models.Inventory, error) {
			return inventory, nil
		},
		UpdateFunc: func(updated *models.Inventory) error {
			inventory.Quantity = updated.Quantity
			return nil
		},
	}
	transactionRepo := &mocks.MockInventoryTransactionRepository{
		CreateFunc: func(transaction *models.InventoryTransaction) error {
			return nil
		},
	}

	service := services.NewInventoryService(inventoryRepo, transactionRepo, &mocks.MockProductRepository{})
	result, err := service.Adjust(services.InventoryAdjustmentInput{
		InventoryID: 1,
		Quantity:    -3,
		Description: "Stock Opname",
	})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, float64(7), result.Quantity)
}

func TestInventoryServiceOperationalTransaction(t *testing.T) {
	SetupTest(t)

	inventory := &models.Inventory{
		Model:       gorm.Model{ID: 1},
		ProductID:   1,
		FishBatchID: 1,
		Quantity:    10,
		Unit:        "kg",
		Status:      "available",
		Product:     models.Product{Name: "Nila"},
		FishBatch:   models.FishBatch{BatchCode: "BTCH-2026-0001"},
	}
	createdTransaction := &models.InventoryTransaction{}
	inventoryRepo := &mocks.MockInventoryRepository{
		FindByIDFunc: func(id uint) (*models.Inventory, error) {
			return inventory, nil
		},
		UpdateFunc: func(updated *models.Inventory) error {
			inventory.Quantity = updated.Quantity
			inventory.Status = updated.Status
			return nil
		},
	}
	transactionRepo := &mocks.MockInventoryTransactionRepository{
		CreateFunc: func(transaction *models.InventoryTransaction) error {
			*createdTransaction = *transaction
			return nil
		},
	}

	service := services.NewInventoryService(inventoryRepo, transactionRepo, &mocks.MockProductRepository{})
	result, err := service.RecordOperationalTransaction(services.InventoryOperationalTransactionInput{
		InventoryID: 1,
		Type:        "OUT",
		Quantity:    4,
		Description: "Feeding preparation",
		Reference:   "FEED-2026-0001",
	})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, float64(6), result.Quantity)
	assert.Equal(t, "OUT", createdTransaction.Type)
	assert.Equal(t, float64(4), createdTransaction.Quantity)
	assert.Equal(t, "FEED-2026-0001", createdTransaction.Reference)
}

func TestInventoryServiceInventoryNotFound(t *testing.T) {
	SetupTest(t)

	inventoryRepo := &mocks.MockInventoryRepository{
		FindByIDFunc: func(id uint) (*models.Inventory, error) {
			return nil, nil
		},
	}

	service := services.NewInventoryService(inventoryRepo, &mocks.MockInventoryTransactionRepository{}, &mocks.MockProductRepository{})
	result, err := service.Adjust(services.InventoryAdjustmentInput{
		InventoryID: 999,
		Quantity:    5,
	})

	assert.ErrorIs(t, err, services.ErrInventoryNotFound)
	assert.Nil(t, result)
}

func TestInventoryServiceInsufficientStock(t *testing.T) {
	SetupTest(t)

	inventoryRepo := &mocks.MockInventoryRepository{
		FindAvailableByProductFunc: func(productID uint) ([]models.Inventory, error) {
			return []models.Inventory{
				{
					Model:     models.Inventory{}.Model,
					ProductID: productID,
					Quantity:  3,
					Unit:      "kg",
					Status:    "available",
					Product:   models.Product{Name: "Nila"},
				},
			}, nil
		},
		UpdateFunc: func(inventory *models.Inventory) error {
			return nil
		},
	}

	service := services.NewInventoryService(inventoryRepo, &mocks.MockInventoryTransactionRepository{}, &mocks.MockProductRepository{})
	err := service.DeductProductInventory(1, 5, "INV-2026-000001", "Checkout Order", nil)

	assert.ErrorIs(t, err, services.ErrInsufficientInventory)
}
