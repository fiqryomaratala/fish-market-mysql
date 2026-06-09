package services

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

var ErrFishBatchNotFound = errors.New("fish batch not found")
var ErrPondInactive = errors.New("pond is not active")

type FishBatchListParams struct {
	PondID   uint
	FishType string
	Status   string
	Page     int
	Limit    int
}

type FishBatchListResult struct {
	Batches []models.FishBatch
	Total   int64
	Page    int
	Limit   int
}

type CreateFishBatchInput struct {
	PondID          uint
	FishType        string
	SeedCount       int
	AverageWeight   float64
	StartDate       time.Time
	ExpectedHarvest time.Time
	Audit           *AuditContext
}

type UpdateFishBatchInput struct {
	PondID          uint
	FishType        string
	SeedCount       int
	CurrentCount    int
	AverageWeight   float64
	StartDate       time.Time
	ExpectedHarvest time.Time
	Status          string
}

type FishBatchService interface {
	Create(input CreateFishBatchInput) (*models.FishBatch, error)
	GetAll(params FishBatchListParams) (*FishBatchListResult, error)
	GetByID(id uint) (*models.FishBatch, error)
	Update(id uint, input UpdateFishBatchInput) (*models.FishBatch, error)
	Delete(id uint) error
}

type fishBatchService struct {
	batchRepo repositories.FishBatchRepository
	pondRepo  repositories.PondRepository
}

func NewFishBatchService(batchRepo repositories.FishBatchRepository, pondRepo repositories.PondRepository) FishBatchService {
	return &fishBatchService{
		batchRepo: batchRepo,
		pondRepo:  pondRepo,
	}
}

func (s *fishBatchService) Create(input CreateFishBatchInput) (*models.FishBatch, error) {
	pond, err := s.pondRepo.FindByID(input.PondID)
	if err != nil {
		return nil, err
	}
	if pond == nil {
		return nil, ErrPondNotFound
	}
	if !strings.EqualFold(strings.TrimSpace(pond.Status), "active") {
		return nil, ErrPondInactive
	}

	batchCode, err := s.generateBatchCode()
	if err != nil {
		return nil, err
	}

	batch := &models.FishBatch{
		BatchCode:       batchCode,
		PondID:          input.PondID,
		FishType:        strings.TrimSpace(input.FishType),
		SeedCount:       input.SeedCount,
		CurrentCount:    input.SeedCount,
		AverageWeight:   input.AverageWeight,
		StartDate:       input.StartDate,
		ExpectedHarvest: input.ExpectedHarvest,
		Status:          "active",
	}

	if err := s.batchRepo.Create(batch); err != nil {
		return nil, err
	}

	if input.Audit != nil {
		helpers.LogActivity(input.Audit.UserID, "CREATE", "FISH_BATCH", "Membuat batch "+batch.BatchCode, input.Audit.IPAddress, input.Audit.UserAgent)
	}

	return s.batchRepo.FindByID(batch.ID)
}

func (s *fishBatchService) GetAll(params FishBatchListParams) (*FishBatchListResult, error) {
	batches, total, err := s.batchRepo.FindAll(repositories.FishBatchFilter{
		PondID:   params.PondID,
		FishType: strings.TrimSpace(params.FishType),
		Status:   strings.TrimSpace(params.Status),
		Page:     params.Page,
		Limit:    params.Limit,
	})
	if err != nil {
		return nil, err
	}

	return &FishBatchListResult{
		Batches: batches,
		Total:   total,
		Page:    params.Page,
		Limit:   params.Limit,
	}, nil
}

func (s *fishBatchService) GetByID(id uint) (*models.FishBatch, error) {
	batch, err := s.batchRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if batch == nil {
		return nil, ErrFishBatchNotFound
	}

	return batch, nil
}

func (s *fishBatchService) Update(id uint, input UpdateFishBatchInput) (*models.FishBatch, error) {
	batch, err := s.batchRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if batch == nil {
		return nil, ErrFishBatchNotFound
	}

	pond, err := s.pondRepo.FindByID(input.PondID)
	if err != nil {
		return nil, err
	}
	if pond == nil {
		return nil, ErrPondNotFound
	}
	if !strings.EqualFold(strings.TrimSpace(pond.Status), "active") {
		return nil, ErrPondInactive
	}

	batch.PondID = input.PondID
	batch.FishType = strings.TrimSpace(input.FishType)
	batch.SeedCount = input.SeedCount
	batch.CurrentCount = input.CurrentCount
	batch.AverageWeight = input.AverageWeight
	batch.StartDate = input.StartDate
	batch.ExpectedHarvest = input.ExpectedHarvest
	batch.Status = strings.TrimSpace(input.Status)

	if err := s.batchRepo.Update(batch); err != nil {
		return nil, err
	}

	return s.batchRepo.FindByID(batch.ID)
}

func (s *fishBatchService) Delete(id uint) error {
	batch, err := s.batchRepo.FindByID(id)
	if err != nil {
		return err
	}
	if batch == nil {
		return ErrFishBatchNotFound
	}

	return s.batchRepo.Delete(batch)
}

func (s *fishBatchService) generateBatchCode() (string, error) {
	year := time.Now().Year()
	total, err := s.batchRepo.CountByYear(year)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("BTCH-%d-%04d", year, total+1), nil
}
