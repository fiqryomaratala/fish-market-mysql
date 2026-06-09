package repositories

import (
	"github.com/fiqryomaratala/backend/internal/dto"
	"gorm.io/gorm"
)

type DashboardRepository interface {
	GetSummary() (*dto.DashboardSummary, error)
	GetProductionByPond() ([]dto.DashboardProductionItem, error)
	GetHarvestByMonth() ([]dto.DashboardHarvestItem, error)
	GetFeedByBatch() ([]dto.DashboardFeedItem, error)
	GetBatchStatusCounts() (*dto.DashboardBatchStatusResponse, error)
	GetRecentHarvests(limit int) ([]dto.DashboardRecentHarvestItem, error)
}

type dashboardRepository struct {
	db *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) DashboardRepository {
	return &dashboardRepository{db: db}
}

func (r *dashboardRepository) GetSummary() (*dto.DashboardSummary, error) {
	summary := &dto.DashboardSummary{}

	if err := r.db.Table("products").Count(&summary.TotalProducts).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("ponds").Count(&summary.TotalPonds).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("fish_batches").Count(&summary.TotalBatches).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("fish_batches").Where("status = ?", "active").Count(&summary.ActiveBatches).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("harvests").Count(&summary.TotalHarvests).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("feeding_logs").Count(&summary.TotalFeedingLogs).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("harvests").Select("COALESCE(SUM(total_weight), 0)").Scan(&summary.TotalHarvestWeight).Error; err != nil {
		return nil, err
	}

	return summary, nil
}

func (r *dashboardRepository) GetProductionByPond() ([]dto.DashboardProductionItem, error) {
	var items []dto.DashboardProductionItem

	err := r.db.Table("fish_batches").
		Select("ponds.name as pond, COUNT(fish_batches.id) as total_batch").
		Joins("JOIN ponds ON ponds.id = fish_batches.pond_id").
		Group("ponds.id, ponds.name").
		Order("ponds.name ASC").
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetHarvestByMonth() ([]dto.DashboardHarvestItem, error) {
	var items []dto.DashboardHarvestItem

	err := r.db.Table("harvests").
		Select("MONTH(harvest_date) as month_num, COALESCE(SUM(total_weight), 0) as total_weight").
		Group("MONTH(harvest_date)").
		Order("MONTH(harvest_date) ASC").
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetFeedByBatch() ([]dto.DashboardFeedItem, error) {
	var items []dto.DashboardFeedItem

	err := r.db.Table("feeding_logs").
		Select("fish_batches.batch_code as batch_code, COALESCE(SUM(feeding_logs.feed_amount), 0) as total_feed").
		Joins("JOIN fish_batches ON fish_batches.id = feeding_logs.fish_batch_id").
		Group("fish_batches.id, fish_batches.batch_code").
		Order("fish_batches.batch_code ASC").
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetBatchStatusCounts() (*dto.DashboardBatchStatusResponse, error) {
	var response dto.DashboardBatchStatusResponse

	if err := r.db.Table("fish_batches").Where("status = ?", "active").Count(&response.Active).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("fish_batches").Where("status = ?", "harvested").Count(&response.Harvested).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("fish_batches").Where("status = ?", "cancelled").Count(&response.Cancelled).Error; err != nil {
		return nil, err
	}

	return &response, nil
}

func (r *dashboardRepository) GetRecentHarvests(limit int) ([]dto.DashboardRecentHarvestItem, error) {
	var items []dto.DashboardRecentHarvestItem

	err := r.db.Table("harvests").
		Select("fish_batches.batch_code as batch_code, ponds.name as pond, harvests.total_weight as weight, DATE_FORMAT(harvests.harvest_date, '%Y-%m-%d') as date").
		Joins("JOIN fish_batches ON fish_batches.id = harvests.fish_batch_id").
		Joins("JOIN ponds ON ponds.id = fish_batches.pond_id").
		Order("harvests.harvest_date DESC").
		Limit(limit).
		Scan(&items).Error

	return items, err
}
