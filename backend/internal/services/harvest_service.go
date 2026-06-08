package services

import (
	"errors"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

var ErrHarvestNotFound = errors.New("harvest not found")

type HarvestListParams struct {
	FishBatchID uint
	StartDate   *time.Time
	EndDate     *time.Time
	Page        int
	Limit       int
}

type HarvestListResult struct {
	Harvests []models.Harvest
	Total    int64
	Page     int
	Limit    int
}

type SaveHarvestInput struct {
	FishBatchID   uint
	HarvestDate   time.Time
	TotalWeight   float64
	FishCount     int
	AverageWeight float64
	Notes         string
}

type HarvestSummaryResult struct {
	TotalHarvests int64   `json:"total_harvests"`
	TotalWeight   float64 `json:"total_weight"`
	TotalFish     int64   `json:"total_fish"`
}

type HarvestService interface {
	Create(input SaveHarvestInput) (*models.Harvest, error)
	GetAll(params HarvestListParams) (*HarvestListResult, error)
	GetByID(id uint) (*models.Harvest, error)
	Update(id uint, input SaveHarvestInput) (*models.Harvest, error)
	Delete(id uint) error
	GetSummary() (*HarvestSummaryResult, error)
}

type harvestService struct {
	harvestRepo repositories.HarvestRepository
	batchRepo   repositories.FishBatchRepository
}

func NewHarvestService(harvestRepo repositories.HarvestRepository, batchRepo repositories.FishBatchRepository) HarvestService {
	return &harvestService{
		harvestRepo: harvestRepo,
		batchRepo:   batchRepo,
	}
}

func (s *harvestService) Create(input SaveHarvestInput) (*models.Harvest, error) {
	batch, err := s.getFishBatch(input.FishBatchID)
	if err != nil {
		return nil, err
	}

	harvest := &models.Harvest{
		FishBatchID:   input.FishBatchID,
		HarvestDate:   input.HarvestDate,
		TotalWeight:   input.TotalWeight,
		FishCount:     input.FishCount,
		AverageWeight: input.AverageWeight,
		Notes:         strings.TrimSpace(input.Notes),
	}

	if err := s.harvestRepo.Create(harvest); err != nil {
		return nil, err
	}

	if err := s.markBatchAsHarvested(batch, input.FishCount); err != nil {
		return nil, err
	}

	return s.harvestRepo.FindByID(harvest.ID)
}

func (s *harvestService) GetAll(params HarvestListParams) (*HarvestListResult, error) {
	harvests, total, err := s.harvestRepo.FindAll(repositories.HarvestFilter{
		FishBatchID: params.FishBatchID,
		StartDate:   params.StartDate,
		EndDate:     params.EndDate,
		Page:        params.Page,
		Limit:       params.Limit,
	})
	if err != nil {
		return nil, err
	}

	return &HarvestListResult{
		Harvests: harvests,
		Total:    total,
		Page:     params.Page,
		Limit:    params.Limit,
	}, nil
}

func (s *harvestService) GetByID(id uint) (*models.Harvest, error) {
	harvest, err := s.harvestRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if harvest == nil {
		return nil, ErrHarvestNotFound
	}

	return harvest, nil
}

func (s *harvestService) Update(id uint, input SaveHarvestInput) (*models.Harvest, error) {
	harvest, err := s.harvestRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if harvest == nil {
		return nil, ErrHarvestNotFound
	}

	batch, err := s.getFishBatch(input.FishBatchID)
	if err != nil {
		return nil, err
	}

	harvest.FishBatchID = input.FishBatchID
	harvest.HarvestDate = input.HarvestDate
	harvest.TotalWeight = input.TotalWeight
	harvest.FishCount = input.FishCount
	harvest.AverageWeight = input.AverageWeight
	harvest.Notes = strings.TrimSpace(input.Notes)

	if err := s.harvestRepo.Update(harvest); err != nil {
		return nil, err
	}

	if err := s.markBatchAsHarvested(batch, input.FishCount); err != nil {
		return nil, err
	}

	return s.harvestRepo.FindByID(harvest.ID)
}

func (s *harvestService) Delete(id uint) error {
	harvest, err := s.harvestRepo.FindByID(id)
	if err != nil {
		return err
	}
	if harvest == nil {
		return ErrHarvestNotFound
	}

	return s.harvestRepo.Delete(harvest)
}

func (s *harvestService) GetSummary() (*HarvestSummaryResult, error) {
	summary, err := s.harvestRepo.GetSummary()
	if err != nil {
		return nil, err
	}

	return &HarvestSummaryResult{
		TotalHarvests: summary.TotalHarvests,
		TotalWeight:   summary.TotalWeight,
		TotalFish:     summary.TotalFish,
	}, nil
}

func (s *harvestService) getFishBatch(id uint) (*models.FishBatch, error) {
	batch, err := s.batchRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if batch == nil {
		return nil, ErrFishBatchNotFound
	}

	return batch, nil
}

func (s *harvestService) markBatchAsHarvested(batch *models.FishBatch, fishCount int) error {
	batch.Status = "harvested"
	batch.CurrentCount = fishCount

	return s.batchRepo.Update(batch)
}
