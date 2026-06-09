package services

import (
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

type DashboardService interface {
	GetSummary() (*dto.DashboardSummaryResponse, error)
	GetProduction() ([]dto.DashboardProductionItem, error)
	GetHarvestAnalytics() ([]dto.DashboardHarvestItem, error)
	GetFeedAnalytics() ([]dto.DashboardFeedItem, error)
	GetBatchStatus() (*dto.DashboardBatchStatusResponse, error)
	GetRecentHarvests() ([]dto.DashboardRecentHarvestItem, error)
}

type dashboardService struct {
	dashboardRepo repositories.DashboardRepository
}

func NewDashboardService(dashboardRepo repositories.DashboardRepository) DashboardService {
	return &dashboardService{dashboardRepo: dashboardRepo}
}

func (s *dashboardService) GetSummary() (*dto.DashboardSummaryResponse, error) {
	summary, err := s.dashboardRepo.GetSummary()
	if err != nil {
		return nil, err
	}

	return &dto.DashboardSummaryResponse{Summary: *summary}, nil
}

func (s *dashboardService) GetProduction() ([]dto.DashboardProductionItem, error) {
	return s.dashboardRepo.GetProductionByPond()
}

func (s *dashboardService) GetHarvestAnalytics() ([]dto.DashboardHarvestItem, error) {
	items, err := s.dashboardRepo.GetHarvestByMonth()
	if err != nil {
		return nil, err
	}

	for index := range items {
		items[index].Month = time.Month(items[index].MonthNum).String()[:3]
	}

	return items, nil
}

func (s *dashboardService) GetFeedAnalytics() ([]dto.DashboardFeedItem, error) {
	return s.dashboardRepo.GetFeedByBatch()
}

func (s *dashboardService) GetBatchStatus() (*dto.DashboardBatchStatusResponse, error) {
	return s.dashboardRepo.GetBatchStatusCounts()
}

func (s *dashboardService) GetRecentHarvests() ([]dto.DashboardRecentHarvestItem, error) {
	return s.dashboardRepo.GetRecentHarvests(10)
}
