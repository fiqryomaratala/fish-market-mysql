package services

import (
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

type TrackingService interface {
	GetByBatchCode(batchCode string) (*models.FishBatch, error)
}

type trackingService struct {
	batchRepo repositories.FishBatchRepository
}

func NewTrackingService(batchRepo repositories.FishBatchRepository) TrackingService {
	return &trackingService{batchRepo: batchRepo}
}

func (s *trackingService) GetByBatchCode(batchCode string) (*models.FishBatch, error) {
	batch, err := s.batchRepo.FindByBatchCode(strings.TrimSpace(batchCode))
	if err != nil {
		return nil, err
	}
	if batch == nil {
		return nil, ErrFishBatchNotFound
	}

	return batch, nil
}
