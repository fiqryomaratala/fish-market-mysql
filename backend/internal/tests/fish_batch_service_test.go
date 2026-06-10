package tests

import (
	"fmt"
	"testing"
	"time"

	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestFishBatchServiceCreateBatch(t *testing.T) {
	SetupTest(t)

	pondRepo := &mocks.MockPondRepository{
		FindByIDFunc: func(id uint) (*models.Pond, error) {
			return &models.Pond{Model: gorm.Model{ID: id}, Name: "Kolam A", Status: "active"}, nil
		},
	}
	batchRepo := &mocks.MockFishBatchRepository{
		CountByYearFunc: func(year int) (int64, error) {
			return 0, nil
		},
		CreateFunc: func(batch *models.FishBatch) error {
			batch.ID = 1
			return nil
		},
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return &models.FishBatch{Model: gorm.Model{ID: id}, BatchCode: "BTCH-2026-0001", PondID: 1, FishType: "Nila", SeedCount: 1000, CurrentCount: 1000, Status: "active"}, nil
		},
	}

	service := services.NewFishBatchService(batchRepo, pondRepo)
	batch, err := service.Create(services.CreateFishBatchInput{
		PondID:          1,
		FishType:        "Nila",
		SeedCount:       1000,
		AverageWeight:   0.05,
		StartDate:       time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC),
		ExpectedHarvest: time.Date(2026, 12, 1, 0, 0, 0, 0, time.UTC),
	})

	assert.NoError(t, err)
	assert.NotNil(t, batch)
	assert.Equal(t, "BTCH-2026-0001", batch.BatchCode)
	assert.Equal(t, 1000, batch.CurrentCount)
	assert.Equal(t, "active", batch.Status)
}

func TestFishBatchServiceGenerateBatchCode(t *testing.T) {
	SetupTest(t)

	currentYear := time.Now().Year()
	batchRepo := &mocks.MockFishBatchRepository{
		CountByYearFunc: func(year int) (int64, error) {
			assert.Equal(t, currentYear, year)
			return 24, nil
		},
		CreateFunc: func(batch *models.FishBatch) error {
			batch.ID = 2
			return nil
		},
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return &models.FishBatch{Model: gorm.Model{ID: id}, BatchCode: fmt.Sprintf("BTCH-%d-0025", currentYear), CurrentCount: 500, Status: "active"}, nil
		},
	}
	pondRepo := &mocks.MockPondRepository{
		FindByIDFunc: func(id uint) (*models.Pond, error) {
			return &models.Pond{Model: gorm.Model{ID: id}, Status: "active"}, nil
		},
	}

	service := services.NewFishBatchService(batchRepo, pondRepo)
	batch, err := service.Create(services.CreateFishBatchInput{
		PondID:          1,
		FishType:        "Lele",
		SeedCount:       500,
		AverageWeight:   0.03,
		StartDate:       time.Now(),
		ExpectedHarvest: time.Now().AddDate(0, 3, 0),
	})

	assert.NoError(t, err)
	assert.NotNil(t, batch)
	assert.Equal(t, fmt.Sprintf("BTCH-%d-0025", currentYear), batch.BatchCode)
}

func TestFishBatchServiceUpdateBatch(t *testing.T) {
	SetupTest(t)

	batch := &models.FishBatch{Model: gorm.Model{ID: 1}, PondID: 1, FishType: "Nila", SeedCount: 1000, CurrentCount: 1000, Status: "active"}
	pondRepo := &mocks.MockPondRepository{
		FindByIDFunc: func(id uint) (*models.Pond, error) {
			return &models.Pond{Model: gorm.Model{ID: id}, Status: "active"}, nil
		},
	}
	batchRepo := &mocks.MockFishBatchRepository{
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return batch, nil
		},
		UpdateFunc: func(updated *models.FishBatch) error {
			*batch = *updated
			return nil
		},
	}
	batchRepo.FindByIDFunc = func(id uint) (*models.FishBatch, error) {
		return batch, nil
	}

	service := services.NewFishBatchService(batchRepo, pondRepo)
	updated, err := service.Update(1, services.UpdateFishBatchInput{
		PondID:          1,
		FishType:        "Gurame",
		SeedCount:       900,
		CurrentCount:    850,
		AverageWeight:   0.2,
		StartDate:       time.Now(),
		ExpectedHarvest: time.Now().AddDate(0, 4, 0),
		Status:          "active",
	})

	assert.NoError(t, err)
	assert.NotNil(t, updated)
	assert.Equal(t, "Gurame", updated.FishType)
	assert.Equal(t, 850, updated.CurrentCount)
}

func TestFishBatchServiceDeleteBatch(t *testing.T) {
	SetupTest(t)

	deleted := false
	batchRepo := &mocks.MockFishBatchRepository{
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return &models.FishBatch{Model: gorm.Model{ID: id}, BatchCode: "BTCH-2026-0001"}, nil
		},
		DeleteFunc: func(batch *models.FishBatch) error {
			deleted = true
			return nil
		},
	}

	service := services.NewFishBatchService(batchRepo, &mocks.MockPondRepository{})
	err := service.Delete(1)

	assert.NoError(t, err)
	assert.True(t, deleted)
}

func TestFishBatchServiceBatchNotFound(t *testing.T) {
	SetupTest(t)

	batchRepo := &mocks.MockFishBatchRepository{
		FindByIDFunc: func(id uint) (*models.FishBatch, error) {
			return nil, nil
		},
	}

	service := services.NewFishBatchService(batchRepo, &mocks.MockPondRepository{})
	batch, err := service.GetByID(999)

	assert.ErrorIs(t, err, services.ErrFishBatchNotFound)
	assert.Nil(t, batch)
}
