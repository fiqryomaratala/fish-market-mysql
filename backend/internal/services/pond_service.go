package services

import (
	"errors"
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

var ErrPondNotFound = errors.New("pond not found")

type PondListParams struct {
	Search string
	Page   int
	Limit  int
}

type PondListResult struct {
	Ponds []models.Pond
	Total int64
	Page  int
	Limit int
}

type SavePondInput struct {
	Name        string
	Location    string
	Capacity    int
	Area        float64
	WaterType   string
	Description string
}

type PondService interface {
	Create(input SavePondInput) (*models.Pond, error)
	GetAll(params PondListParams) (*PondListResult, error)
	GetByID(id uint) (*models.Pond, error)
	Update(id uint, input SavePondInput) (*models.Pond, error)
	Delete(id uint) error
}

type pondService struct {
	pondRepo repositories.PondRepository
}

func NewPondService(pondRepo repositories.PondRepository) PondService {
	return &pondService{pondRepo: pondRepo}
}

func (s *pondService) Create(input SavePondInput) (*models.Pond, error) {
	pond := &models.Pond{
		Name:        strings.TrimSpace(input.Name),
		Location:    strings.TrimSpace(input.Location),
		Capacity:    input.Capacity,
		Area:        input.Area,
		WaterType:   strings.TrimSpace(input.WaterType),
		Status:      "active",
		Description: strings.TrimSpace(input.Description),
	}

	if err := s.pondRepo.Create(pond); err != nil {
		return nil, err
	}

	return pond, nil
}

func (s *pondService) GetAll(params PondListParams) (*PondListResult, error) {
	ponds, total, err := s.pondRepo.FindAll(repositories.PondFilter{
		Search: params.Search,
		Page:   params.Page,
		Limit:  params.Limit,
	})
	if err != nil {
		return nil, err
	}

	return &PondListResult{
		Ponds: ponds,
		Total: total,
		Page:  params.Page,
		Limit: params.Limit,
	}, nil
}

func (s *pondService) GetByID(id uint) (*models.Pond, error) {
	pond, err := s.pondRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if pond == nil {
		return nil, ErrPondNotFound
	}

	return pond, nil
}

func (s *pondService) Update(id uint, input SavePondInput) (*models.Pond, error) {
	pond, err := s.pondRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if pond == nil {
		return nil, ErrPondNotFound
	}

	pond.Name = strings.TrimSpace(input.Name)
	pond.Location = strings.TrimSpace(input.Location)
	pond.Capacity = input.Capacity
	pond.Area = input.Area
	pond.WaterType = strings.TrimSpace(input.WaterType)
	pond.Description = strings.TrimSpace(input.Description)

	if err := s.pondRepo.Update(pond); err != nil {
		return nil, err
	}

	return pond, nil
}

func (s *pondService) Delete(id uint) error {
	pond, err := s.pondRepo.FindByID(id)
	if err != nil {
		return err
	}
	if pond == nil {
		return ErrPondNotFound
	}

	return s.pondRepo.Delete(pond)
}
