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
	Title       string `json:"title"`
	Description string `json:"description"`
	Module      string `json:"module"`
	Action      string `json:"action"`
	CreatedAt   string `json:"created_at"`
}
