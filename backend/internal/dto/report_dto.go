package dto

type HarvestReportItem struct {
	BatchCode   string  `json:"batch_code"`
	Pond        string  `json:"pond"`
	FishType    string  `json:"fish_type"`
	HarvestDate string  `json:"harvest_date"`
	FishCount   int     `json:"fish_count"`
	TotalWeight float64 `json:"total_weight"`
}

type ProductionReportItem struct {
	Pond      string `json:"pond"`
	Batch     int64  `json:"batch"`
	FishCount int64  `json:"fish_count"`
}

type FeedingReportItem struct {
	BatchCode string  `json:"batch_code"`
	FeedType  string  `json:"feed_type"`
	TotalFeed float64 `json:"total_feed"`
}
