package services

import (
	"errors"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

var ErrFeedingLogNotFound = errors.New("feeding log not found")

type FeedingLogListParams struct {
	FishBatchID uint
	StartDate   *time.Time
	EndDate     *time.Time
	Page        int
	Limit       int
}

type FeedingLogListResult struct {
	Logs  []models.FeedingLog
	Total int64
	Page  int
	Limit int
}

type SaveFeedingLogInput struct {
	FishBatchID uint
	FeedType    string
	FeedAmount  float64
	FeedTime    time.Time
	Notes       string
}

type FeedingLogService interface {
	Create(input SaveFeedingLogInput) (*models.FeedingLog, error)
	GetAll(params FeedingLogListParams) (*FeedingLogListResult, error)
	GetByID(id uint) (*models.FeedingLog, error)
	Update(id uint, input SaveFeedingLogInput) (*models.FeedingLog, error)
	Delete(id uint) error
}

type feedingLogService struct {
	logRepo   repositories.FeedingLogRepository
	batchRepo repositories.FishBatchRepository
}

func NewFeedingLogService(logRepo repositories.FeedingLogRepository, batchRepo repositories.FishBatchRepository) FeedingLogService {
	return &feedingLogService{
		logRepo:   logRepo,
		batchRepo: batchRepo,
	}
}

func (s *feedingLogService) Create(input SaveFeedingLogInput) (*models.FeedingLog, error) {
	if _, err := s.getFishBatch(input.FishBatchID); err != nil {
		return nil, err
	}

	log := &models.FeedingLog{
		FishBatchID: input.FishBatchID,
		FeedType:    strings.TrimSpace(input.FeedType),
		FeedAmount:  input.FeedAmount,
		FeedTime:    input.FeedTime,
		Notes:       strings.TrimSpace(input.Notes),
	}

	if err := s.logRepo.Create(log); err != nil {
		return nil, err
	}

	return s.logRepo.FindByID(log.ID)
}

func (s *feedingLogService) GetAll(params FeedingLogListParams) (*FeedingLogListResult, error) {
	logs, total, err := s.logRepo.FindAll(repositories.FeedingLogFilter{
		FishBatchID: params.FishBatchID,
		StartDate:   params.StartDate,
		EndDate:     params.EndDate,
		Page:        params.Page,
		Limit:       params.Limit,
	})
	if err != nil {
		return nil, err
	}

	return &FeedingLogListResult{
		Logs:  logs,
		Total: total,
		Page:  params.Page,
		Limit: params.Limit,
	}, nil
}

func (s *feedingLogService) GetByID(id uint) (*models.FeedingLog, error) {
	log, err := s.logRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if log == nil {
		return nil, ErrFeedingLogNotFound
	}

	return log, nil
}

func (s *feedingLogService) Update(id uint, input SaveFeedingLogInput) (*models.FeedingLog, error) {
	log, err := s.logRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if log == nil {
		return nil, ErrFeedingLogNotFound
	}

	if _, err := s.getFishBatch(input.FishBatchID); err != nil {
		return nil, err
	}

	log.FishBatchID = input.FishBatchID
	log.FeedType = strings.TrimSpace(input.FeedType)
	log.FeedAmount = input.FeedAmount
	log.FeedTime = input.FeedTime
	log.Notes = strings.TrimSpace(input.Notes)

	if err := s.logRepo.Update(log); err != nil {
		return nil, err
	}

	return s.logRepo.FindByID(log.ID)
}

func (s *feedingLogService) Delete(id uint) error {
	log, err := s.logRepo.FindByID(id)
	if err != nil {
		return err
	}
	if log == nil {
		return ErrFeedingLogNotFound
	}

	return s.logRepo.Delete(log)
}

func (s *feedingLogService) getFishBatch(id uint) (*models.FishBatch, error) {
	batch, err := s.batchRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if batch == nil {
		return nil, ErrFishBatchNotFound
	}

	return batch, nil
}
