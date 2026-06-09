package services

import (
	"errors"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

var ErrInvalidReportType = errors.New("invalid report type")

const reportDateLayout = "2006-01-02"

type ReportFilter struct {
	StartDate *time.Time
	EndDate   *time.Time
	PondID    uint
	FishType  string
}

type ReportService interface {
	GetHarvestReport(filter ReportFilter) ([]dto.HarvestReportItem, error)
	GetProductionReport() ([]dto.ProductionReportItem, error)
	GetFeedingReport() ([]dto.FeedingReportItem, error)
}

type reportService struct {
	reportRepo repositories.ReportRepository
}

func NewReportService(reportRepo repositories.ReportRepository) ReportService {
	return &reportService{reportRepo: reportRepo}
}

func (s *reportService) GetHarvestReport(filter ReportFilter) ([]dto.HarvestReportItem, error) {
	harvests, err := s.reportRepo.GetHarvestReport(repositories.HarvestReportFilter{
		StartDate: filter.StartDate,
		EndDate:   filter.EndDate,
		PondID:    filter.PondID,
		FishType:  strings.TrimSpace(filter.FishType),
	})
	if err != nil {
		return nil, err
	}

	items := make([]dto.HarvestReportItem, 0, len(harvests))
	for _, harvest := range harvests {
		items = append(items, dto.HarvestReportItem{
			BatchCode:   harvest.FishBatch.BatchCode,
			Pond:        harvest.FishBatch.Pond.Name,
			FishType:    harvest.FishBatch.FishType,
			HarvestDate: harvest.HarvestDate.Format(reportDateLayout),
			FishCount:   harvest.FishCount,
			TotalWeight: harvest.TotalWeight,
		})
	}

	return items, nil
}

func (s *reportService) GetProductionReport() ([]dto.ProductionReportItem, error) {
	return s.reportRepo.GetProductionReport()
}

func (s *reportService) GetFeedingReport() ([]dto.FeedingReportItem, error) {
	return s.reportRepo.GetFeedingReport()
}
