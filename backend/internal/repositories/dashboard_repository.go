package repositories

import (
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"gorm.io/gorm"
)

type DashboardRepository interface {
	GetSummary() (*dto.DashboardSummary, error)
	GetHarvestByMonth() ([]dto.DashboardHarvestItem, error)
	GetProductionByPond() ([]dto.DashboardProductionItem, error)
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

	if err := r.db.Table("orders").Where("payment_status = ?", "paid").Select("COALESCE(SUM(total_price), 0)").Scan(&summary.TotalRevenue).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("orders").Count(&summary.TotalOrders).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("products").Count(&summary.TotalProducts).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("users").Where("role = ?", "customer").Count(&summary.TotalCustomers).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("fish_batches").Count(&summary.TotalBatches).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("ponds").Count(&summary.TotalPonds).Error; err != nil {
		return nil, err
	}

	return summary, nil
}

func (r *dashboardRepository) GetSalesSeries(startDate time.Time) ([]dto.DashboardSalesPoint, error) {
	var items []dto.DashboardSalesPoint

	err := r.db.Table("orders").
		Select("DATE_FORMAT(created_at, '%Y-%m-%d') as date, COALESCE(SUM(total_price), 0) as revenue, COUNT(id) as orders").
		Where("created_at >= ?", startDate).
		Group("DATE(created_at)").
		Order("DATE(created_at) ASC").
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetTopSellingProduct() (*dto.DashboardTopSellingProduct, error) {
	var item dto.DashboardTopSellingProduct

	err := r.db.Table("order_items").
		Select("products.id as product_id, products.name as product_name, products.image_url as image_url, COALESCE(SUM(order_items.quantity), 0) as sold, COALESCE(SUM(order_items.subtotal), 0) as revenue").
		Joins("JOIN products ON products.id = order_items.product_id").
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Where("orders.status <> ?", "cancelled").
		Group("products.id, products.name, products.image_url").
		Order("sold DESC, revenue DESC, products.name ASC").
		Limit(1).
		Scan(&item).Error
	if err != nil {
		return nil, err
	}
	if item.ProductID == 0 {
		return nil, nil
	}

	return &item, nil
}

func (r *dashboardRepository) GetHarvestByMonth() ([]dto.DashboardHarvestItem, error) {
	var items []dto.DashboardHarvestItem

	err := r.db.Table("harvests").
		Select("MONTH(harvest_date) as month_num, COALESCE(SUM(total_weight), 0) as total_weight").
		Where("YEAR(harvest_date) = ?", time.Now().UTC().Year()).
		Group("MONTH(harvest_date)").
		Order("MONTH(harvest_date) ASC").
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetHarvestSchedule(limit int) ([]dto.DashboardHarvestScheduleItem, error) {
	var items []dto.DashboardHarvestScheduleItem

	err := r.db.Table("fish_batches").
		Select("fish_batches.batch_code as batch_code, ponds.name as pond, DATE_FORMAT(fish_batches.expected_harvest, '%Y-%m-%d') as harvest_date, fish_batches.status as status").
		Joins("JOIN ponds ON ponds.id = fish_batches.pond_id").
		Where("fish_batches.status = ?", "active").
		Order("fish_batches.expected_harvest ASC").
		Limit(limit).
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetLatestOrders(limit int) ([]dto.DashboardLatestOrderItem, error) {
	var items []dto.DashboardLatestOrderItem

	err := r.db.Table("orders").
		Select("orders.id as id, orders.invoice_number as invoice, users.name as customer, orders.total_price as total, orders.status as status, DATE_FORMAT(orders.created_at, '%Y-%m-%dT%H:%i:%sZ') as date").
		Joins("JOIN users ON users.id = orders.user_id").
		Order("orders.created_at DESC").
		Limit(limit).
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetInventoryAlerts(limit int, threshold float64) ([]dto.DashboardInventoryAlertItem, error) {
	var items []dto.DashboardInventoryAlertItem

	err := r.db.Table("inventories").
		Select("inventories.id as id, inventories.product_id as product_id, products.name as product, fish_batches.batch_code as batch_code, inventories.quantity as quantity, inventories.unit as unit, inventories.status as status").
		Joins("JOIN products ON products.id = inventories.product_id").
		Joins("LEFT JOIN fish_batches ON fish_batches.id = inventories.fish_batch_id").
		Where("inventories.quantity <= ?", threshold).
		Order("inventories.quantity ASC, products.name ASC").
		Limit(limit).
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetRecentActivity(limit int) ([]dto.DashboardActivityItem, error) {
	var items []dto.DashboardActivityItem

	err := r.db.Table("activity_logs").
		Select("activity_logs.id as id, users.name as user, CONCAT(UPPER(activity_logs.action), ' ', UPPER(activity_logs.module)) as title, activity_logs.description as description, activity_logs.module as module, activity_logs.action as action, DATE_FORMAT(activity_logs.created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at").
		Joins("LEFT JOIN users ON users.id = activity_logs.user_id").
		Order("activity_logs.created_at DESC").
		Limit(limit).
		Scan(&items).Error

	return items, err
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
	response := &dto.DashboardBatchStatusResponse{}

	if err := r.db.Table("fish_batches").Where("status = ?", "active").Count(&response.Active).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("fish_batches").Where("status = ?", "harvested").Count(&response.Harvested).Error; err != nil {
		return nil, err
	}
	if err := r.db.Table("fish_batches").Where("status = ?", "cancelled").Count(&response.Cancelled).Error; err != nil {
		return nil, err
	}

	return response, nil
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
