package repositories

import (
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type HarvestReportFilter struct {
	StartDate *time.Time
	EndDate   *time.Time
	PondID    uint
	FishType  string
}

type ReportRepository interface {
	GetHarvestReport(filter HarvestReportFilter) ([]models.Harvest, error)
	GetProductionReport() ([]dto.ProductionReportItem, error)
	GetFeedingReport() ([]dto.FeedingReportItem, error)
}

type reportRepository struct {
	db *gorm.DB
}

func NewReportRepository(db *gorm.DB) ReportRepository {
	return &reportRepository{db: db}
}

func (r *reportRepository) GetHarvestReport(filter HarvestReportFilter) ([]models.Harvest, error) {
	var harvests []models.Harvest

	query := r.db.Model(&models.Harvest{}).
		Preload("FishBatch").
		Preload("FishBatch.Pond").
		Joins("JOIN fish_batches ON fish_batches.id = harvests.fish_batch_id").
		Joins("JOIN ponds ON ponds.id = fish_batches.pond_id")

	if filter.StartDate != nil {
		query = query.Where("harvests.harvest_date >= ?", *filter.StartDate)
	}
	if filter.EndDate != nil {
		query = query.Where("harvests.harvest_date <= ?", *filter.EndDate)
	}
	if filter.PondID > 0 {
		query = query.Where("fish_batches.pond_id = ?", filter.PondID)
	}
	if strings.TrimSpace(filter.FishType) != "" {
		query = query.Where("fish_batches.fish_type = ?", strings.TrimSpace(filter.FishType))
	}

	if err := query.Order("harvests.harvest_date DESC").Find(&harvests).Error; err != nil {
		return nil, err
	}

	return harvests, nil
}

func (r *reportRepository) GetProductionReport() ([]dto.ProductionReportItem, error) {
	var items []dto.ProductionReportItem

	err := r.db.Table("fish_batches").
		Select("ponds.name as pond, COUNT(fish_batches.id) as batch, COALESCE(SUM(fish_batches.current_count), 0) as fish_count").
		Joins("JOIN ponds ON ponds.id = fish_batches.pond_id").
		Group("ponds.id, ponds.name").
		Order("ponds.name ASC").
		Scan(&items).Error

	return items, err
}

func (r *reportRepository) GetFeedingReport() ([]dto.FeedingReportItem, error) {
	var items []dto.FeedingReportItem

	err := r.db.Table("feeding_logs").
		Select("fish_batches.batch_code as batch_code, feeding_logs.feed_type as feed_type, COALESCE(SUM(feeding_logs.feed_amount), 0) as total_feed").
		Joins("JOIN fish_batches ON fish_batches.id = feeding_logs.fish_batch_id").
		Group("fish_batches.id, fish_batches.batch_code, feeding_logs.feed_type").
		Order("fish_batches.batch_code ASC, feeding_logs.feed_type ASC").
		Scan(&items).Error

	return items, err
}
