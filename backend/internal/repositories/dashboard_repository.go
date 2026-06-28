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
		Select("DATE(created_at) as date, COALESCE(SUM(total_price), 0) as revenue, COUNT(id) as orders").
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
		Select("activity_logs.id as id, users.name as user, users.photo_url as avatar, CONCAT(UPPER(activity_logs.action), ' ', UPPER(activity_logs.module)) as title, activity_logs.description as description, activity_logs.module as module, activity_logs.action as action, DATE_FORMAT(activity_logs.created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at").
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

func (r *dashboardRepository) GetStaffTotalPonds() (int64, error) {
	var total int64
	err := r.db.Table("ponds").Count(&total).Error
	return total, err
}

func (r *dashboardRepository) GetStaffActivePonds() (int64, error) {
	var total int64
	err := r.db.Table("ponds").Where("LOWER(status) = ?", "active").Count(&total).Error
	return total, err
}

func (r *dashboardRepository) GetStaffTotalBatches() (int64, error) {
	var total int64
	err := r.db.Table("fish_batches").Count(&total).Error
	return total, err
}

func (r *dashboardRepository) GetStaffGrowingBatches() (int64, error) {
	var total int64
	err := r.db.Table("fish_batches").
		Where("LOWER(status) IN ?", []string{"active", "growing"}).
		Count(&total).Error
	return total, err
}

func (r *dashboardRepository) GetStaffReadyToHarvestCount(referenceDate time.Time) (int64, error) {
	var total int64
	err := r.db.Table("fish_batches").
		Where(`
			LOWER(status) IN ? OR (
				LOWER(status) NOT IN ? AND DATE(expected_harvest) <= DATE(?)
			)
		`,
			[]string{"ready_to_harvest", "ready to harvest"},
			[]string{"harvested", "cancelled"},
			referenceDate,
		).
		Count(&total).Error
	return total, err
}

func (r *dashboardRepository) GetStaffTodayFeedings(referenceDate time.Time) (int64, error) {
	var total int64
	err := r.db.Table("feeding_logs").
		Where("DATE(feed_time) = DATE(?)", referenceDate).
		Count(&total).Error
	return total, err
}

func (r *dashboardRepository) GetStaffTodayHarvests(referenceDate time.Time) (int64, error) {
	var total int64
	err := r.db.Table("harvests").
		Where("DATE(harvest_date) = DATE(?)", referenceDate).
		Count(&total).Error
	return total, err
}

func (r *dashboardRepository) GetStaffInventoryAlerts(limit int, threshold float64) ([]dto.StaffInventoryAlertItem, error) {
	var items []dto.StaffInventoryAlertItem

	err := r.db.Table("inventories").
		Select(`
			inventories.id as id,
			products.name as feed_name,
			inventories.quantity as current_stock,
			? as minimum_stock,
			CASE
				WHEN inventories.quantity <= 0 THEN 'Out Of Stock'
				ELSE 'Low Stock'
			END as status
		`, threshold).
		Joins("JOIN products ON products.id = inventories.product_id").
		Where("inventories.quantity <= ?", threshold).
		Order("inventories.quantity ASC, products.name ASC").
		Limit(limit).
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetStaffUpcomingHarvests(limit int, referenceDate time.Time) ([]dto.StaffUpcomingHarvestItem, error) {
	var items []dto.StaffUpcomingHarvestItem

	err := r.db.Table("fish_batches").
		Select(`
			fish_batches.id as id,
			fish_batches.batch_code as batch_code,
			fish_batches.fish_type as fish_type,
			ponds.name as pond,
			DATE_FORMAT(fish_batches.expected_harvest, '%Y-%m-%d') as harvest_date,
			DATEDIFF(DATE(fish_batches.expected_harvest), DATE(?)) as days_remaining
		`, referenceDate).
		Joins("JOIN ponds ON ponds.id = fish_batches.pond_id").
		Where("LOWER(fish_batches.status) NOT IN ?", []string{"harvested", "cancelled"}).
		Order("fish_batches.expected_harvest ASC").
		Limit(limit).
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetStaffRecentActivities(limit int) ([]dto.StaffDashboardActivityItem, error) {
	var items []dto.StaffDashboardActivityItem

	err := r.db.Table("activity_logs").
		Select(`
			activity_logs.id as id,
			COALESCE(users.name, 'System') as user,
			activity_logs.action as action,
			activity_logs.module as module,
			DATE_FORMAT(activity_logs.created_at, '%Y-%m-%dT%H:%i:%sZ') as time
		`).
		Joins("LEFT JOIN users ON users.id = activity_logs.user_id").
		Order("activity_logs.created_at DESC").
		Limit(limit).
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetStaffHarvestSchedule(referenceDate time.Time, weeks int) ([]dto.StaffHarvestSchedulePoint, error) {
	var items []dto.StaffHarvestSchedulePoint

	endDate := referenceDate.AddDate(0, 0, (weeks*7)-1)

	err := r.db.Table("fish_batches").
		Select(`
			DATE_FORMAT(MIN(expected_harvest), 'W%v %b') as week,
			COUNT(id) as total
		`).
		Where("DATE(expected_harvest) BETWEEN DATE(?) AND DATE(?)", referenceDate, endDate).
		Where("LOWER(status) NOT IN ?", []string{"harvested", "cancelled"}).
		Group("YEAR(expected_harvest), WEEK(expected_harvest, 1)").
		Order("MIN(expected_harvest) ASC").
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetStaffFeedUsageTrend(startDate time.Time) ([]dto.StaffFeedUsagePoint, error) {
	var items []dto.StaffFeedUsagePoint

	err := r.db.Table("feeding_logs").
		Select("DATE_FORMAT(MIN(feed_time), '%Y-%m-%d') as date, COALESCE(SUM(feed_amount), 0) as amount").
		Where("DATE(feed_time) >= DATE(?)", startDate).
		Group("DATE(feed_time)").
		Order("DATE(feed_time) ASC").
		Scan(&items).Error

	return items, err
}

func (r *dashboardRepository) GetStaffFishBatchStatusBreakdown(referenceDate time.Time) ([]dto.StaffFishBatchStatusPoint, error) {
	counts := make([]dto.StaffFishBatchStatusPoint, 0, 4)

	var stocking int64
	if err := r.db.Table("fish_batches").Where("LOWER(status) = ?", "stocking").Count(&stocking).Error; err != nil {
		return nil, err
	}
	counts = append(counts, dto.StaffFishBatchStatusPoint{Name: "Stocking", Value: stocking})

	var growing int64
	if err := r.db.Table("fish_batches").Where("LOWER(status) IN ?", []string{"active", "growing"}).Count(&growing).Error; err != nil {
		return nil, err
	}
	counts = append(counts, dto.StaffFishBatchStatusPoint{Name: "Growing", Value: growing})

	var ready int64
	if err := r.db.Table("fish_batches").
		Where(`
			LOWER(status) IN ? OR (
				LOWER(status) NOT IN ? AND DATE(expected_harvest) <= DATE(?)
			)
		`,
			[]string{"ready_to_harvest", "ready to harvest"},
			[]string{"harvested", "cancelled"},
			referenceDate,
		).
		Count(&ready).Error; err != nil {
		return nil, err
	}
	counts = append(counts, dto.StaffFishBatchStatusPoint{Name: "Ready To Harvest", Value: ready})

	var harvested int64
	if err := r.db.Table("fish_batches").Where("LOWER(status) = ?", "harvested").Count(&harvested).Error; err != nil {
		return nil, err
	}
	counts = append(counts, dto.StaffFishBatchStatusPoint{Name: "Harvested", Value: harvested})

	return counts, nil
}
