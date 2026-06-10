package tests

import (
	"testing"
	"time"

	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestHarvestServiceCreateHarvest(t *testing.T) {
	SetupTest(t)

	batch := &models.FishBatch{Model: gorm.Model{ID: 1}, BatchCode: "BTCH-2026-0001", FishType: "Nila", CurrentCount: 1000, Status: "active"}
	var createdHarvest *models.Harvest
	batchRepo := &mocks.MockFishBatchRepository{
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return batch, nil
		},
		UpdateFunc: func(updated *models.FishBatch) error {
			*batch = *updated
			return nil
		},
	}
	harvestRepo := &mocks.MockHarvestRepository{
		CreateFunc: func(harvest *models.Harvest) error {
			harvest.ID = 1
			createdHarvest = harvest
			return nil
		},
		FindByIDFunc: func(id uint) (*models.Harvest, error) {
			return &models.Harvest{Model: gorm.Model{ID: id}, FishBatchID: 1, TotalWeight: 850, FishCount: 900}, nil
		},
	}

	service := services.NewHarvestService(harvestRepo, batchRepo, &mocks.MockInventoryService{})
	harvest, err := service.Create(services.SaveHarvestInput{
		FishBatchID:   1,
		HarvestDate:   time.Date(2026, 12, 1, 0, 0, 0, 0, time.UTC),
		TotalWeight:   850,
		FishCount:     900,
		AverageWeight: 0.94,
		Notes:         "Panen utama",
	})

	assert.NoError(t, err)
	assert.NotNil(t, harvest)
	assert.NotNil(t, createdHarvest)
	assert.Equal(t, uint(1), createdHarvest.FishBatchID)
}

func TestHarvestServiceUpdateInventoryAfterHarvest(t *testing.T) {
	SetupTest(t)

	batch := &models.FishBatch{Model: gorm.Model{ID: 1}, BatchCode: "BTCH-2026-0001", FishType: "Nila", Status: "active"}
	inventoryCalled := false
	batchRepo := &mocks.MockFishBatchRepository{
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return batch, nil
		},
		UpdateFunc: func(updated *models.FishBatch) error {
			*batch = *updated
			return nil
		},
	}
	harvestRepo := &mocks.MockHarvestRepository{
		CreateFunc: func(harvest *models.Harvest) error {
			harvest.ID = 1
			return nil
		},
		FindByIDFunc: func(id uint) (*models.Harvest, error) {
			return &models.Harvest{Model: gorm.Model{ID: id}}, nil
		},
	}
	inventoryService := &mocks.MockInventoryService{
		CreateHarvestInventoryFunc: func(batch *models.FishBatch, totalWeight float64) error {
			inventoryCalled = true
			assert.Equal(t, float64(850), totalWeight)
			return nil
		},
	}

	service := services.NewHarvestService(harvestRepo, batchRepo, inventoryService)
	_, err := service.Create(services.SaveHarvestInput{
		FishBatchID:   1,
		HarvestDate:   time.Now(),
		TotalWeight:   850,
		FishCount:     900,
		AverageWeight: 0.94,
	})

	assert.NoError(t, err)
	assert.True(t, inventoryCalled)
}

func TestHarvestServiceUpdateBatchStatus(t *testing.T) {
	SetupTest(t)

	batch := &models.FishBatch{Model: gorm.Model{ID: 1}, BatchCode: "BTCH-2026-0001", FishType: "Nila", CurrentCount: 1000, Status: "active"}
	batchRepo := &mocks.MockFishBatchRepository{
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return batch, nil
		},
		UpdateFunc: func(updated *models.FishBatch) error {
			*batch = *updated
			return nil
		},
	}
	harvestRepo := &mocks.MockHarvestRepository{
		CreateFunc: func(harvest *models.Harvest) error {
			harvest.ID = 1
			return nil
		},
		FindByIDFunc: func(id uint) (*models.Harvest, error) {
			return &models.Harvest{Model: gorm.Model{ID: id}}, nil
		},
	}

	service := services.NewHarvestService(harvestRepo, batchRepo, &mocks.MockInventoryService{})
	_, err := service.Create(services.SaveHarvestInput{
		FishBatchID:   1,
		HarvestDate:   time.Now(),
		TotalWeight:   850,
		FishCount:     900,
		AverageWeight: 0.94,
	})

	assert.NoError(t, err)
	assert.Equal(t, "harvested", batch.Status)
	assert.Equal(t, 900, batch.CurrentCount)
}

func TestHarvestServiceHarvestNotFound(t *testing.T) {
	SetupTest(t)

	harvestRepo := &mocks.MockHarvestRepository{
		FindByIDFunc: func(id uint) (*models.Harvest, error) {
			return nil, nil
		},
	}

	service := services.NewHarvestService(harvestRepo, &mocks.MockFishBatchRepository{}, &mocks.MockInventoryService{})
	harvest, err := service.GetByID(999)

	assert.ErrorIs(t, err, services.ErrHarvestNotFound)
	assert.Nil(t, harvest)
}
