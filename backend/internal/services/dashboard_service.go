package services

import (
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

type DashboardService interface {
	GetSummary() (*dto.DashboardSummaryResponse, error)
	GetSales() (*dto.DashboardSalesResponse, error)
	GetHarvest() (*dto.DashboardHarvestResponse, error)
	GetLatestOrders() ([]dto.DashboardLatestOrderItem, error)
	GetInventoryAlerts() ([]dto.DashboardInventoryAlertItem, error)
	GetRecentActivity() ([]dto.DashboardActivityItem, error)
	GetProduction() ([]dto.DashboardProductionItem, error)
	GetFeedAnalytics() ([]dto.DashboardFeedItem, error)
	GetBatchStatus() (*dto.DashboardBatchStatusResponse, error)
	GetRecentHarvests() ([]dto.DashboardRecentHarvestItem, error)
	GetStaffDashboard() (*dto.StaffDashboardResponse, error)
}

type dashboardService struct {
	dashboardRepo repositories.DashboardRepository
}

type salesDashboardRepository interface {
	GetSalesSeries(startDate time.Time) ([]dto.DashboardSalesPoint, error)
	GetTopSellingProduct() (*dto.DashboardTopSellingProduct, error)
}

type harvestScheduleRepository interface {
	GetHarvestSchedule(limit int) ([]dto.DashboardHarvestScheduleItem, error)
}

type latestOrdersRepository interface {
	GetLatestOrders(limit int) ([]dto.DashboardLatestOrderItem, error)
}

type inventoryAlertsRepository interface {
	GetInventoryAlerts(limit int, threshold float64) ([]dto.DashboardInventoryAlertItem, error)
}

type recentActivityRepository interface {
	GetRecentActivity(limit int) ([]dto.DashboardActivityItem, error)
}

type staffDashboardRepository interface {
	GetStaffTotalPonds() (int64, error)
	GetStaffActivePonds() (int64, error)
	GetStaffTotalBatches() (int64, error)
	GetStaffGrowingBatches() (int64, error)
	GetStaffReadyToHarvestCount(referenceDate time.Time) (int64, error)
	GetStaffTodayFeedings(referenceDate time.Time) (int64, error)
	GetStaffTodayHarvests(referenceDate time.Time) (int64, error)
	GetStaffInventoryAlerts(limit int, threshold float64) ([]dto.StaffInventoryAlertItem, error)
	GetStaffUpcomingHarvests(limit int, referenceDate time.Time) ([]dto.StaffUpcomingHarvestItem, error)
	GetStaffRecentActivities(limit int) ([]dto.StaffDashboardActivityItem, error)
	GetStaffHarvestSchedule(referenceDate time.Time, weeks int) ([]dto.StaffHarvestSchedulePoint, error)
	GetStaffFeedUsageTrend(startDate time.Time) ([]dto.StaffFeedUsagePoint, error)
	GetStaffFishBatchStatusBreakdown(referenceDate time.Time) ([]dto.StaffFishBatchStatusPoint, error)
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

func (s *dashboardService) GetSales() (*dto.DashboardSalesResponse, error) {
	repo, ok := s.dashboardRepo.(salesDashboardRepository)
	if !ok {
		return &dto.DashboardSalesResponse{
			Series: []dto.DashboardSalesPoint{},
		}, nil
	}

	startDate := time.Now().UTC().AddDate(0, 0, -29)

	items, err := repo.GetSalesSeries(startDate)
	if err != nil {
		return nil, err
	}

	byDate := make(map[string]dto.DashboardSalesPoint, len(items))
	for _, item := range items {
		byDate[item.Date] = item
	}

	series := make([]dto.DashboardSalesPoint, 0, 30)
	for index := 0; index < 30; index++ {
		dateValue := startDate.AddDate(0, 0, index).Format("2006-01-02")
		point, exists := byDate[dateValue]
		if !exists {
			point = dto.DashboardSalesPoint{
				Date:    dateValue,
				Revenue: 0,
				Orders:  0,
			}
		}
		series = append(series, point)
	}

	topSellingProduct, err := repo.GetTopSellingProduct()
	if err != nil {
		return nil, err
	}

	return &dto.DashboardSalesResponse{
		Series:            series,
		TopSellingProduct: topSellingProduct,
	}, nil
}

func (s *dashboardService) GetHarvest() (*dto.DashboardHarvestResponse, error) {
	chartItems, err := s.dashboardRepo.GetHarvestByMonth()
	if err != nil {
		return nil, err
	}

	chartByMonth := make(map[int]dto.DashboardHarvestChartItem, len(chartItems))
	for _, item := range chartItems {
		item.Month = time.Month(item.MonthNum).String()[:3]
		chartByMonth[item.MonthNum] = item
	}

	chart := make([]dto.DashboardHarvestChartItem, 0, 12)
	for month := 1; month <= 12; month++ {
		item, exists := chartByMonth[month]
		if !exists {
			item = dto.DashboardHarvestChartItem{
				MonthNum:    month,
				Month:       time.Month(month).String()[:3],
				TotalWeight: 0,
			}
		}
		chart = append(chart, item)
	}

	repo, ok := s.dashboardRepo.(harvestScheduleRepository)
	if !ok {
		return &dto.DashboardHarvestResponse{
			Chart:    chart,
			Schedule: []dto.DashboardHarvestScheduleItem{},
		}, nil
	}

	schedule, err := repo.GetHarvestSchedule(6)
	if err != nil {
		return nil, err
	}

	for index := range schedule {
		schedule[index].Status = toDisplayStatus(schedule[index].Status)
	}

	return &dto.DashboardHarvestResponse{
		Chart:    chart,
		Schedule: schedule,
	}, nil
}

func (s *dashboardService) GetLatestOrders() ([]dto.DashboardLatestOrderItem, error) {
	repo, ok := s.dashboardRepo.(latestOrdersRepository)
	if !ok {
		return []dto.DashboardLatestOrderItem{}, nil
	}

	items, err := repo.GetLatestOrders(6)
	if err != nil {
		return nil, err
	}

	for index := range items {
		items[index].Status = toDisplayStatus(items[index].Status)
	}

	return items, nil
}

func (s *dashboardService) GetProduction() ([]dto.DashboardProductionItem, error) {
	return s.dashboardRepo.GetProductionByPond()
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

func (s *dashboardService) GetInventoryAlerts() ([]dto.DashboardInventoryAlertItem, error) {
	repo, ok := s.dashboardRepo.(inventoryAlertsRepository)
	if !ok {
		return []dto.DashboardInventoryAlertItem{}, nil
	}

	return repo.GetInventoryAlerts(6, 5)
}

func (s *dashboardService) GetRecentActivity() ([]dto.DashboardActivityItem, error) {
	repo, ok := s.dashboardRepo.(recentActivityRepository)
	if !ok {
		return []dto.DashboardActivityItem{}, nil
	}

	items, err := repo.GetRecentActivity(6)
	if err != nil {
		return nil, err
	}

	for index := range items {
		if strings.TrimSpace(items[index].User) == "" {
			items[index].User = "System"
		}
	}

	return items, nil
}

func (s *dashboardService) GetStaffDashboard() (*dto.StaffDashboardResponse, error) {
	repo, ok := s.dashboardRepo.(staffDashboardRepository)
	if !ok {
		return &dto.StaffDashboardResponse{}, nil
	}

	now := time.Now().UTC()
	startOfTrend := now.AddDate(0, 0, -6)
	const minimumStockThreshold = 5

	totalPonds, err := repo.GetStaffTotalPonds()
	if err != nil {
		return nil, err
	}

	activePonds, err := repo.GetStaffActivePonds()
	if err != nil {
		return nil, err
	}

	totalBatches, err := repo.GetStaffTotalBatches()
	if err != nil {
		return nil, err
	}

	growingBatches, err := repo.GetStaffGrowingBatches()
	if err != nil {
		return nil, err
	}

	readyToHarvest, err := repo.GetStaffReadyToHarvestCount(now)
	if err != nil {
		return nil, err
	}

	todayFeedings, err := repo.GetStaffTodayFeedings(now)
	if err != nil {
		return nil, err
	}

	todayHarvests, err := repo.GetStaffTodayHarvests(now)
	if err != nil {
		return nil, err
	}

	inventoryAlerts, err := repo.GetStaffInventoryAlerts(6, minimumStockThreshold)
	if err != nil {
		return nil, err
	}

	upcomingHarvests, err := repo.GetStaffUpcomingHarvests(6, now)
	if err != nil {
		return nil, err
	}

	recentActivities, err := repo.GetStaffRecentActivities(6)
	if err != nil {
		return nil, err
	}

	harvestSchedule, err := repo.GetStaffHarvestSchedule(now, 6)
	if err != nil {
		return nil, err
	}

	feedUsageTrend, err := repo.GetStaffFeedUsageTrend(startOfTrend)
	if err != nil {
		return nil, err
	}

	statusBreakdown, err := repo.GetStaffFishBatchStatusBreakdown(now)
	if err != nil {
		return nil, err
	}

	feedUsageByDate := make(map[string]float64, len(feedUsageTrend))
	for _, item := range feedUsageTrend {
		feedUsageByDate[item.Date] = item.Amount
	}

	filledFeedTrend := make([]dto.StaffFeedUsagePoint, 0, 7)
	for index := 0; index < 7; index++ {
		dateValue := startOfTrend.AddDate(0, 0, index)
		dateKey := dateValue.Format("2006-01-02")
		filledFeedTrend = append(filledFeedTrend, dto.StaffFeedUsagePoint{
			Date:   dateValue.Format("02 Jan"),
			Amount: feedUsageByDate[dateKey],
		})
	}

	statusByName := map[string]int64{
		"Stocking":         0,
		"Growing":          0,
		"Ready To Harvest": 0,
		"Harvested":        0,
	}
	for _, item := range statusBreakdown {
		statusByName[item.Name] = item.Value
	}

	tasks := buildStaffTasks(todayFeedings, todayHarvests, activePonds, readyToHarvest, int64(len(inventoryAlerts)))

	return &dto.StaffDashboardResponse{
		TotalPonds:     totalPonds,
		ActivePonds:    activePonds,
		TotalBatches:   totalBatches,
		GrowingBatches: growingBatches,
		ReadyToHarvest: readyToHarvest,
		TodayFeedings:  todayFeedings,
		TodayHarvests:  todayHarvests,
		LowStockFeeds:  int64(len(inventoryAlerts)),
		RecentActivities: recentActivities,
		UpcomingHarvests: upcomingHarvests,
		InventoryAlerts:  inventoryAlerts,
		HarvestSchedule:  harvestSchedule,
		FeedUsageTrend:   filledFeedTrend,
		FishBatchStatus: []dto.StaffFishBatchStatusPoint{
			{Name: "Stocking", Value: statusByName["Stocking"]},
			{Name: "Growing", Value: statusByName["Growing"]},
			{Name: "Ready To Harvest", Value: statusByName["Ready To Harvest"]},
			{Name: "Harvested", Value: statusByName["Harvested"]},
		},
		TodayTasks: tasks,
	}, nil
}

func toDisplayStatus(value string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return "Unknown"
	}

	segments := strings.FieldsFunc(strings.ToLower(trimmed), func(char rune) bool {
		return char == '_' || char == '-' || char == ' '
	})

	for index, segment := range segments {
		if segment == "" {
			continue
		}
		segments[index] = strings.ToUpper(segment[:1]) + segment[1:]
	}

	return strings.Join(segments, " ")
}

func buildStaffTasks(todayFeedings, todayHarvests, activePonds, readyToHarvest, lowStockFeeds int64) []dto.StaffTaskItem {
	feedingStatus := "Pending"
	feedingPriority := "High"
	if todayFeedings > 0 {
		feedingStatus = "Completed"
		feedingPriority = "Medium"
	}

	pondStatus := "Pending"
	if activePonds > 0 {
		pondStatus = "In Progress"
	}

	harvestStatus := "Pending"
	harvestPriority := "Medium"
	if todayHarvests > 0 {
		harvestStatus = "Completed"
	} else if readyToHarvest > 0 {
		harvestStatus = "Attention"
		harvestPriority = "Critical"
	}

	inventoryStatus := "Completed"
	inventoryPriority := "Low"
	if lowStockFeeds > 0 {
		inventoryStatus = "Attention"
		inventoryPriority = "High"
	}

	return []dto.StaffTaskItem{
		{
			ID:          "feeding",
			Title:       "Input Feeding",
			Description: "Pastikan log pemberian pakan harian sudah tercatat lengkap.",
			Status:      feedingStatus,
			Deadline:    "Hari ini",
			Priority:    feedingPriority,
		},
		{
			ID:          "pond-condition",
			Title:       "Check Pond Condition",
			Description: "Verifikasi kondisi kolam aktif dan indikator budidaya utama.",
			Status:      pondStatus,
			Deadline:    "Hari ini",
			Priority:    "Medium",
		},
		{
			ID:          "harvest",
			Title:       "Record Harvest",
			Description: "Catat panen untuk batch yang siap atau sudah diproses hari ini.",
			Status:      harvestStatus,
			Deadline:    "Hari ini",
			Priority:    harvestPriority,
		},
		{
			ID:          "inventory",
			Title:       "Update Inventory",
			Description: "Sinkronkan stok pakan dan tindak lanjuti item di bawah minimum.",
			Status:      inventoryStatus,
			Deadline:    "Hari ini",
			Priority:    inventoryPriority,
		},
	}
}
