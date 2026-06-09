package dto

type DashboardSummary struct {
	TotalProducts      int64   `json:"total_products"`
	TotalPonds         int64   `json:"total_ponds"`
	TotalBatches       int64   `json:"total_batches"`
	ActiveBatches      int64   `json:"active_batches"`
	TotalHarvests      int64   `json:"total_harvests"`
	TotalHarvestWeight float64 `json:"total_harvest_weight"`
	TotalFeedingLogs   int64   `json:"total_feeding_logs"`
}

type DashboardSummaryResponse struct {
	Summary DashboardSummary `json:"summary"`
}

type DashboardProductionItem struct {
	Pond       string `json:"pond"`
	TotalBatch int64  `json:"total_batch"`
}

type DashboardHarvestItem struct {
	MonthNum    int     `json:"-"`
	Month       string  `json:"month"`
	TotalWeight float64 `json:"total_weight"`
}

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
