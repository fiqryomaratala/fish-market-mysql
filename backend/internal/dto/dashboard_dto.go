package dto

type DashboardSummary struct {
	TotalRevenue       float64 `json:"total_revenue"`
	TotalOrders        int64   `json:"total_orders"`
	TotalProducts      int64   `json:"total_products"`
	TotalCustomers     int64   `json:"total_customers"`
	TotalBatches       int64   `json:"total_batches"`
	TotalPonds         int64   `json:"total_ponds"`
	ActiveBatches      int64   `json:"active_batches,omitempty"`
	TotalHarvests      int64   `json:"total_harvests,omitempty"`
	TotalHarvestWeight float64 `json:"total_harvest_weight,omitempty"`
	TotalFeedingLogs   int64   `json:"total_feeding_logs,omitempty"`
}

type DashboardSummaryResponse struct {
	Summary DashboardSummary `json:"summary"`
}

type DashboardSalesPoint struct {
	Date    string  `json:"date"`
	Revenue float64 `json:"revenue"`
	Orders  int64   `json:"orders"`
}

type DashboardTopSellingProduct struct {
	ProductID   uint    `json:"product_id"`
	ProductName string  `json:"product_name"`
	ImageURL    string  `json:"image_url"`
	Sold        int64   `json:"sold"`
	Revenue     float64 `json:"revenue"`
}

type DashboardSalesResponse struct {
	Series            []DashboardSalesPoint       `json:"series"`
	TopSellingProduct *DashboardTopSellingProduct `json:"top_selling_product,omitempty"`
}

type DashboardHarvestChartItem struct {
	MonthNum    int     `json:"-"`
	Month       string  `json:"month"`
	TotalWeight float64 `json:"total_weight"`
}

type DashboardProductionItem struct {
	Pond       string `json:"pond"`
	TotalBatch int64  `json:"total_batch"`
}

type DashboardHarvestItem = DashboardHarvestChartItem

type DashboardFeedItem struct {
	BatchCode string  `json:"batch_code"`
	TotalFeed float64 `json:"total_feed"`
}

type DashboardBatchStatusResponse struct {
	Active    int64 `json:"active"`
	Harvested int64 `json:"harvested"`
	Cancelled int64 `json:"cancelled"`
}

type DashboardRecentHarvestItem struct {
	BatchCode string  `json:"batch_code"`
	Pond      string  `json:"pond"`
	Weight    float64 `json:"weight"`
	Date      string  `json:"date"`
}

type DashboardHarvestScheduleItem struct {
	BatchCode   string `json:"batch_code"`
	Pond        string `json:"pond"`
	HarvestDate string `json:"harvest_date"`
	Status      string `json:"status"`
}

type DashboardHarvestResponse struct {
	Chart    []DashboardHarvestChartItem    `json:"chart"`
	Schedule []DashboardHarvestScheduleItem `json:"schedule"`
}

type DashboardLatestOrderItem struct {
	ID       uint    `json:"id"`
	Invoice  string  `json:"invoice"`
	Customer string  `json:"customer"`
	Total    float64 `json:"total"`
	Status   string  `json:"status"`
	Date     string  `json:"date"`
}

type DashboardInventoryAlertItem struct {
	ID        uint    `json:"id"`
	ProductID uint    `json:"product_id"`
	Product   string  `json:"product"`
	BatchCode string  `json:"batch_code"`
	Quantity  float64 `json:"quantity"`
	Unit      string  `json:"unit"`
	Status    string  `json:"status"`
}

type DashboardActivityItem struct {
	ID          uint   `json:"id"`
	User        string `json:"user"`
	Avatar      string `json:"avatar"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Module      string `json:"module"`
	Action      string `json:"action"`
	CreatedAt   string `json:"created_at"`
}

type StaffDashboardActivityItem struct {
	ID     uint   `json:"id"`
	User   string `json:"user"`
	Action string `json:"action"`
	Module string `json:"module"`
	Time   string `json:"time"`
}

type StaffUpcomingHarvestItem struct {
	ID            uint   `json:"id"`
	BatchCode     string `json:"batch_code"`
	FishType      string `json:"fish_type"`
	Pond          string `json:"pond"`
	HarvestDate   string `json:"harvest_date"`
	DaysRemaining int    `json:"days_remaining"`
}

type StaffInventoryAlertItem struct {
	ID           uint    `json:"id"`
	FeedName     string  `json:"feed_name"`
	CurrentStock float64 `json:"current_stock"`
	MinimumStock float64 `json:"minimum_stock"`
	Status       string  `json:"status"`
}

type StaffHarvestSchedulePoint struct {
	Week  string `json:"week"`
	Total int64  `json:"total"`
}

type StaffFeedUsagePoint struct {
	Date   string  `json:"date"`
	Amount float64 `json:"amount"`
}

type StaffFishBatchStatusPoint struct {
	Name  string `json:"name"`
	Value int64  `json:"value"`
}

type StaffTaskItem struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Deadline    string `json:"deadline"`
	Priority    string `json:"priority"`
}

type StaffDashboardResponse struct {
	TotalPonds        int64                        `json:"total_ponds"`
	ActivePonds       int64                        `json:"active_ponds"`
	TotalBatches      int64                        `json:"total_batches"`
	GrowingBatches    int64                        `json:"growing_batches"`
	ReadyToHarvest    int64                        `json:"ready_to_harvest"`
	TodayFeedings     int64                        `json:"today_feedings"`
	TodayHarvests     int64                        `json:"today_harvests"`
	LowStockFeeds     int64                        `json:"low_stock_feeds"`
	RecentActivities  []StaffDashboardActivityItem `json:"recent_activities"`
	UpcomingHarvests  []StaffUpcomingHarvestItem   `json:"upcoming_harvests"`
	InventoryAlerts   []StaffInventoryAlertItem    `json:"inventory_alerts"`
	HarvestSchedule   []StaffHarvestSchedulePoint  `json:"harvest_schedule"`
	FeedUsageTrend    []StaffFeedUsagePoint        `json:"feed_usage_trend"`
	FishBatchStatus   []StaffFishBatchStatusPoint  `json:"fish_batch_status"`
	TodayTasks        []StaffTaskItem              `json:"today_tasks"`
}
