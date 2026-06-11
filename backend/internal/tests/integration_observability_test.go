package tests

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

type storeFeedingLogRepository struct {
	store *integrationStore
}

func (r *storeFeedingLogRepository) Create(log *models.FeedingLog) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if r.store.nextFeedLogID == 0 {
		r.store.nextFeedLogID = 1
	}
	log.ID = r.store.nextFeedLogID
	r.store.nextFeedLogID++
	log.CreatedAt = time.Now()
	log.UpdatedAt = log.CreatedAt
	cloned := *log
	if batch, ok := r.store.batches[log.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	r.store.feedingLogs[log.ID] = &cloned
	return nil
}

func (r *storeFeedingLogRepository) FindAll(filter repositories.FeedingLogFilter) ([]models.FeedingLog, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.FeedingLog, 0)
	for _, log := range r.store.feedingLogs {
		if filter.FishBatchID > 0 && log.FishBatchID != filter.FishBatchID {
			continue
		}
		if filter.StartDate != nil && log.FeedTime.Before(*filter.StartDate) {
			continue
		}
		if filter.EndDate != nil && log.FeedTime.After(*filter.EndDate) {
			continue
		}
		cloned := *log
		if batch, ok := r.store.batches[log.FishBatchID]; ok {
			cloned.FishBatch = *batch
		}
		items = append(items, cloned)
	}
	return items, int64(len(items)), nil
}

func (r *storeFeedingLogRepository) FindByID(id uint) (*models.FeedingLog, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	log, ok := r.store.feedingLogs[id]
	if !ok {
		return nil, nil
	}
	cloned := *log
	if batch, ok := r.store.batches[log.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	return &cloned, nil
}

func (r *storeFeedingLogRepository) Update(log *models.FeedingLog) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.feedingLogs[log.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	log.UpdatedAt = time.Now()
	cloned := *log
	if batch, ok := r.store.batches[log.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	r.store.feedingLogs[log.ID] = &cloned
	return nil
}

func (r *storeFeedingLogRepository) Delete(log *models.FeedingLog) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	delete(r.store.feedingLogs, log.ID)
	return nil
}

type storeNotificationRepository struct {
	store *integrationStore
}

func (r *storeNotificationRepository) Create(notification *models.Notification) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if r.store.nextNotificationID == 0 {
		r.store.nextNotificationID = 1
	}
	notification.ID = r.store.nextNotificationID
	r.store.nextNotificationID++
	notification.CreatedAt = time.Now()
	notification.UpdatedAt = notification.CreatedAt
	cloned := *notification
	r.store.notifications[notification.ID] = &cloned
	return nil
}

func (r *storeNotificationRepository) FindAll(filter repositories.NotificationFilter) ([]models.Notification, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Notification, 0)
	for _, item := range r.store.notifications {
		if item.UserID != filter.UserID {
			continue
		}
		if filter.Type != "" && item.Type != strings.TrimSpace(filter.Type) {
			continue
		}
		cloned := *item
		items = append(items, cloned)
	}
	return items, int64(len(items)), nil
}

func (r *storeNotificationRepository) FindUnreadByUserID(userID uint) ([]models.Notification, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Notification, 0)
	for _, item := range r.store.notifications {
		if item.UserID == userID && !item.IsRead {
			cloned := *item
			items = append(items, cloned)
		}
	}
	return items, nil
}

func (r *storeNotificationRepository) FindByID(id uint) (*models.Notification, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	item, ok := r.store.notifications[id]
	if !ok {
		return nil, nil
	}
	cloned := *item
	return &cloned, nil
}

func (r *storeNotificationRepository) Update(notification *models.Notification) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.notifications[notification.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	notification.UpdatedAt = time.Now()
	cloned := *notification
	r.store.notifications[notification.ID] = &cloned
	return nil
}

func (r *storeNotificationRepository) MarkAllAsRead(userID uint) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	for _, item := range r.store.notifications {
		if item.UserID == userID {
			item.IsRead = true
			item.UpdatedAt = time.Now()
		}
	}
	return nil
}

func (r *storeNotificationRepository) Delete(notification *models.Notification) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	delete(r.store.notifications, notification.ID)
	return nil
}

type storeActivityLogRepository struct {
	store *integrationStore
}

func (r *storeActivityLogRepository) Create(log *models.ActivityLog) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if r.store.nextActivityLogID == 0 {
		r.store.nextActivityLogID = 1
	}
	log.ID = r.store.nextActivityLogID
	r.store.nextActivityLogID++
	log.CreatedAt = time.Now()
	log.UpdatedAt = log.CreatedAt
	cloned := *log
	if user, ok := r.store.users[log.UserID]; ok {
		cloned.User = *cloneUser(user)
	}
	r.store.activityLogs[log.ID] = &cloned
	return nil
}

func (r *storeActivityLogRepository) FindAll(filter repositories.ActivityLogFilter) ([]models.ActivityLog, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.ActivityLog, 0)
	for _, item := range r.store.activityLogs {
		if filter.Module != "" && item.Module != strings.TrimSpace(filter.Module) {
			continue
		}
		if filter.Action != "" && item.Action != strings.TrimSpace(filter.Action) {
			continue
		}
		if filter.UserID > 0 && item.UserID != filter.UserID {
			continue
		}
		cloned := *item
		if user, ok := r.store.users[item.UserID]; ok {
			cloned.User = *cloneUser(user)
		}
		items = append(items, cloned)
	}
	return items, int64(len(items)), nil
}

func (r *storeActivityLogRepository) FindByID(id uint) (*models.ActivityLog, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	item, ok := r.store.activityLogs[id]
	if !ok {
		return nil, nil
	}
	cloned := *item
	if user, ok := r.store.users[item.UserID]; ok {
		cloned.User = *cloneUser(user)
	}
	return &cloned, nil
}

type storeDashboardRepository struct {
	store *integrationStore
}

func (r *storeDashboardRepository) GetSummary() (*dto.DashboardSummary, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	totalWeight := 0.0
	activeBatches := int64(0)
	for _, harvest := range r.store.harvests {
		totalWeight += harvest.TotalWeight
	}
	for _, batch := range r.store.batches {
		if batch.Status == "active" {
			activeBatches++
		}
	}

	return &dto.DashboardSummary{
		TotalProducts:      int64(len(r.store.products)),
		TotalPonds:         int64(len(r.store.ponds)),
		TotalBatches:       int64(len(r.store.batches)),
		ActiveBatches:      activeBatches,
		TotalHarvests:      int64(len(r.store.harvests)),
		TotalHarvestWeight: totalWeight,
		TotalFeedingLogs:   int64(len(r.store.feedingLogs)),
	}, nil
}

func (r *storeDashboardRepository) GetProductionByPond() ([]dto.DashboardProductionItem, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	counts := make(map[string]int64)
	for _, batch := range r.store.batches {
		if pond, ok := r.store.ponds[batch.PondID]; ok {
			counts[pond.Name]++
		}
	}

	items := make([]dto.DashboardProductionItem, 0, len(counts))
	for pond, total := range counts {
		items = append(items, dto.DashboardProductionItem{Pond: pond, TotalBatch: total})
	}
	return items, nil
}

func (r *storeDashboardRepository) GetHarvestByMonth() ([]dto.DashboardHarvestItem, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	byMonth := make(map[int]float64)
	for _, harvest := range r.store.harvests {
		byMonth[int(harvest.HarvestDate.Month())] += harvest.TotalWeight
	}

	items := make([]dto.DashboardHarvestItem, 0, len(byMonth))
	for monthNum, totalWeight := range byMonth {
		items = append(items, dto.DashboardHarvestItem{MonthNum: monthNum, TotalWeight: totalWeight})
	}
	return items, nil
}

func (r *storeDashboardRepository) GetFeedByBatch() ([]dto.DashboardFeedItem, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	byBatch := make(map[string]float64)
	for _, log := range r.store.feedingLogs {
		if batch, ok := r.store.batches[log.FishBatchID]; ok {
			byBatch[batch.BatchCode] += log.FeedAmount
		}
	}

	items := make([]dto.DashboardFeedItem, 0, len(byBatch))
	for code, total := range byBatch {
		items = append(items, dto.DashboardFeedItem{BatchCode: code, TotalFeed: total})
	}
	return items, nil
}

func (r *storeDashboardRepository) GetBatchStatusCounts() (*dto.DashboardBatchStatusResponse, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	resp := &dto.DashboardBatchStatusResponse{}
	for _, batch := range r.store.batches {
		switch batch.Status {
		case "active":
			resp.Active++
		case "harvested":
			resp.Harvested++
		case "cancelled":
			resp.Cancelled++
		}
	}
	return resp, nil
}

func (r *storeDashboardRepository) GetRecentHarvests(limit int) ([]dto.DashboardRecentHarvestItem, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]dto.DashboardRecentHarvestItem, 0)
	count := 0
	for _, harvest := range r.store.harvests {
		if count >= limit {
			break
		}
		batch := r.store.batches[harvest.FishBatchID]
		pondName := ""
		batchCode := ""
		if batch != nil {
			batchCode = batch.BatchCode
			if pond, ok := r.store.ponds[batch.PondID]; ok {
				pondName = pond.Name
			}
		}
		items = append(items, dto.DashboardRecentHarvestItem{
			BatchCode: batchCode,
			Pond:      pondName,
			Weight:    harvest.TotalWeight,
			Date:      harvest.HarvestDate.Format("2006-01-02"),
		})
		count++
	}
	return items, nil
}

type storeReportRepository struct {
	store *integrationStore
}

func (r *storeReportRepository) GetHarvestReport(filter repositories.HarvestReportFilter) ([]models.Harvest, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Harvest, 0)
	for _, harvest := range r.store.harvests {
		if filter.StartDate != nil && harvest.HarvestDate.Before(*filter.StartDate) {
			continue
		}
		if filter.EndDate != nil && harvest.HarvestDate.After(*filter.EndDate) {
			continue
		}
		batch := r.store.batches[harvest.FishBatchID]
		if batch == nil {
			continue
		}
		if filter.PondID > 0 && batch.PondID != filter.PondID {
			continue
		}
		if filter.FishType != "" && batch.FishType != filter.FishType {
			continue
		}
		cloned := *harvest
		cloned.FishBatch = *batch
		if pond, ok := r.store.ponds[batch.PondID]; ok {
			cloned.FishBatch.Pond = *pond
		}
		items = append(items, cloned)
	}
	return items, nil
}

func (r *storeReportRepository) GetProductionReport() ([]dto.ProductionReportItem, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	counts := make(map[string]dto.ProductionReportItem)
	for _, batch := range r.store.batches {
		pond := r.store.ponds[batch.PondID]
		if pond == nil {
			continue
		}
		item := counts[pond.Name]
		item.Pond = pond.Name
		item.Batch++
		item.FishCount += int64(batch.CurrentCount)
		counts[pond.Name] = item
	}
	items := make([]dto.ProductionReportItem, 0, len(counts))
	for _, item := range counts {
		items = append(items, item)
	}
	return items, nil
}

func (r *storeReportRepository) GetFeedingReport() ([]dto.FeedingReportItem, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	keyed := make(map[string]dto.FeedingReportItem)
	for _, log := range r.store.feedingLogs {
		batch := r.store.batches[log.FishBatchID]
		if batch == nil {
			continue
		}
		key := batch.BatchCode + "|" + log.FeedType
		item := keyed[key]
		item.BatchCode = batch.BatchCode
		item.FeedType = log.FeedType
		item.TotalFeed += log.FeedAmount
		keyed[key] = item
	}
	items := make([]dto.FeedingReportItem, 0, len(keyed))
	for _, item := range keyed {
		items = append(items, item)
	}
	return items, nil
}

func TestIntegrationFeedingNotificationActivityTrackingFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	store, router := setupObservabilityIntegrationRouter(t)
	staffToken := loginAndExtractToken(t, router, "staff1@fishmarket.com", "password123")
	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")
	customerToken := loginAndExtractToken(t, router, "customer1@fishmarket.com", "password123")

	pond := createIntegrationPond(t, router, staffToken, "Kolam Observability")
	batch := createIntegrationBatch(t, router, staffToken, pond, "Nila")
	product := store.addProduct(&models.Product{
		Name:        "Produk Nila Observability",
		Description: "Produk untuk observability",
		Price:       42000,
		Stock:       15,
		Category:    "ikan konsumsi",
		Status:      "active",
	})
	store.linkProductToBatch(product.ID, batch)

	feedingRecorder := performJSONRequest(t, router, http.MethodPost, "/api/feeding-logs", map[string]interface{}{
		"fish_batch_id": batch,
		"feed_type":     "Pelet PF-1000",
		"feed_amount":   25,
		"feed_time":     "2026-08-15T08:00:00Z",
		"notes":         "Pemberian pakan pagi",
	}, staffToken)
	require.Equal(t, http.StatusCreated, feedingRecorder.Code)

	getFeedingRecorder := performJSONRequest(t, router, http.MethodGet, "/api/feeding-logs?fish_batch_id="+strconv.Itoa(int(batch)), nil, adminToken)
	require.Equal(t, http.StatusOK, getFeedingRecorder.Code)
	assert.Contains(t, getFeedingRecorder.Body.String(), "Pelet PF-1000")

	trackingRecorder := performJSONRequest(t, router, http.MethodGet, "/api/tracking/BTCH-2026-0001", nil, "")
	require.Equal(t, http.StatusOK, trackingRecorder.Code)
	assert.Contains(t, trackingRecorder.Body.String(), "Pelet PF-1000")
	assert.Contains(t, trackingRecorder.Body.String(), "Kolam Observability")

	harvestRecorder := performJSONRequest(t, router, http.MethodPost, "/api/harvests", map[string]interface{}{
		"fish_batch_id":  batch,
		"harvest_date":   "2026-12-01",
		"total_weight":   850,
		"fish_count":     900,
		"average_weight": 0.94,
		"notes":          "Panen utama",
	}, staffToken)
	require.Equal(t, http.StatusCreated, harvestRecorder.Code)

	notificationsRecorder := performJSONRequest(t, router, http.MethodGet, "/api/notifications", nil, customerToken)
	require.Equal(t, http.StatusOK, notificationsRecorder.Code)

	helpers.CreateNotification(3, "Low Stock", "Stok menurun.", "INVENTORY", "INVENTORY", 1)

	unreadRecorder := performJSONRequest(t, router, http.MethodGet, "/api/notifications/unread", nil, customerToken)
	require.Equal(t, http.StatusOK, unreadRecorder.Code)
	assert.Contains(t, unreadRecorder.Body.String(), "Low Stock")

	var unreadResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(unreadRecorder.Body.Bytes(), &unreadResponse))
	items := unreadResponse.Data.([]interface{})
	notificationID := int(items[0].(map[string]interface{})["id"].(float64))

	markReadRecorder := performJSONRequest(t, router, http.MethodPut, "/api/notifications/"+strconv.Itoa(notificationID)+"/read", nil, customerToken)
	require.Equal(t, http.StatusOK, markReadRecorder.Code)

	markAllRecorder := performJSONRequest(t, router, http.MethodPut, "/api/notifications/read-all", nil, customerToken)
	require.Equal(t, http.StatusOK, markAllRecorder.Code)

	deleteNotificationRecorder := performJSONRequest(t, router, http.MethodDelete, "/api/notifications/"+strconv.Itoa(notificationID), nil, customerToken)
	require.Equal(t, http.StatusOK, deleteNotificationRecorder.Code)

	activityRecorder := performJSONRequest(t, router, http.MethodGet, "/api/activity-logs?module=FEEDING_LOG", nil, adminToken)
	require.Equal(t, http.StatusOK, activityRecorder.Code)
	assert.Contains(t, activityRecorder.Body.String(), "FEEDING_LOG")

	activityDetailRecorder := performJSONRequest(t, router, http.MethodGet, "/api/activity-logs/1", nil, adminToken)
	require.Equal(t, http.StatusOK, activityDetailRecorder.Code)
	assert.Contains(t, activityDetailRecorder.Body.String(), `"action":"LOGIN"`)
}

func TestIntegrationReportsAndDashboardFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	store, router := setupObservabilityIntegrationRouter(t)
	staffToken := loginAndExtractToken(t, router, "staff1@fishmarket.com", "password123")
	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")

	pond := createIntegrationPond(t, router, staffToken, "Kolam Report")
	batch := createIntegrationBatch(t, router, staffToken, pond, "Lele")
	product := store.addProduct(&models.Product{
		Name:        "Produk Lele Report",
		Description: "Produk report",
		Price:       40000,
		Stock:       10,
		Category:    "ikan konsumsi",
		Status:      "active",
	})
	store.linkProductToBatch(product.ID, batch)

	performJSONRequest(t, router, http.MethodPost, "/api/feeding-logs", map[string]interface{}{
		"fish_batch_id": batch,
		"feed_type":     "PF1000",
		"feed_amount":   40,
		"feed_time":     "2026-08-16T08:00:00Z",
		"notes":         "Pakan report",
	}, staffToken)

	performJSONRequest(t, router, http.MethodPost, "/api/harvests", map[string]interface{}{
		"fish_batch_id":  batch,
		"harvest_date":   "2026-12-01",
		"total_weight":   900,
		"fish_count":     950,
		"average_weight": 0.95,
		"notes":          "Panen report",
	}, staffToken)

	dashboardRecorder := performJSONRequest(t, router, http.MethodGet, "/api/dashboard", nil, adminToken)
	require.Equal(t, http.StatusOK, dashboardRecorder.Code)
	assert.Contains(t, dashboardRecorder.Body.String(), `"summary"`)

	productionRecorder := performJSONRequest(t, router, http.MethodGet, "/api/dashboard/production", nil, adminToken)
	require.Equal(t, http.StatusOK, productionRecorder.Code)
	assert.Contains(t, productionRecorder.Body.String(), "Kolam Report")

	harvestDashboardRecorder := performJSONRequest(t, router, http.MethodGet, "/api/dashboard/harvest", nil, adminToken)
	require.Equal(t, http.StatusOK, harvestDashboardRecorder.Code)
	assert.Contains(t, harvestDashboardRecorder.Body.String(), `"month":"Dec"`)

	feedDashboardRecorder := performJSONRequest(t, router, http.MethodGet, "/api/dashboard/feed", nil, adminToken)
	require.Equal(t, http.StatusOK, feedDashboardRecorder.Code)
	assert.Contains(t, feedDashboardRecorder.Body.String(), "BTCH-2026-0001")

	batchStatusRecorder := performJSONRequest(t, router, http.MethodGet, "/api/dashboard/batch-status", nil, adminToken)
	require.Equal(t, http.StatusOK, batchStatusRecorder.Code)
	assert.Contains(t, batchStatusRecorder.Body.String(), `"harvested":1`)

	recentHarvestRecorder := performJSONRequest(t, router, http.MethodGet, "/api/dashboard/recent-harvest", nil, adminToken)
	require.Equal(t, http.StatusOK, recentHarvestRecorder.Code)
	assert.Contains(t, recentHarvestRecorder.Body.String(), "Kolam Report")

	reportHarvestRecorder := performJSONRequest(t, router, http.MethodGet, "/api/reports/harvest?fish_type=Lele", nil, adminToken)
	require.Equal(t, http.StatusOK, reportHarvestRecorder.Code)
	assert.Contains(t, reportHarvestRecorder.Body.String(), `"fish_type":"Lele"`)

	reportProductionRecorder := performJSONRequest(t, router, http.MethodGet, "/api/reports/production", nil, adminToken)
	require.Equal(t, http.StatusOK, reportProductionRecorder.Code)
	assert.Contains(t, reportProductionRecorder.Body.String(), "Kolam Report")

	reportFeedingRecorder := performJSONRequest(t, router, http.MethodGet, "/api/reports/feeding", nil, adminToken)
	require.Equal(t, http.StatusOK, reportFeedingRecorder.Code)
	assert.Contains(t, reportFeedingRecorder.Body.String(), `"feed_type":"PF1000"`)

	exportExcelRecorder := performJSONRequest(t, router, http.MethodGet, "/api/reports/export/excel?type=harvest", nil, adminToken)
	require.Equal(t, http.StatusOK, exportExcelRecorder.Code)
	assert.Equal(t, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", exportExcelRecorder.Header().Get("Content-Type"))

	exportPDFRecorder := performJSONRequest(t, router, http.MethodGet, "/api/reports/export/pdf?type=harvest", nil, adminToken)
	require.Equal(t, http.StatusOK, exportPDFRecorder.Code)
	assert.Equal(t, "application/pdf", exportPDFRecorder.Header().Get("Content-Type"))

}

func setupObservabilityIntegrationRouter(t *testing.T) (*integrationStore, *gin.Engine) {
	t.Helper()

	store, router := setupOperationsIntegrationRouter(t)

	feedingRepo := &storeFeedingLogRepository{store: store}
	notificationRepo := &storeNotificationRepository{store: store}
	activityRepo := &storeActivityLogRepository{store: store}
	dashboardRepo := &storeDashboardRepository{store: store}
	reportRepo := &storeReportRepository{store: store}

	helpers.SetNotificationRepository(notificationRepo)
	helpers.SetActivityLogRepository(activityRepo)
	t.Cleanup(func() {
		helpers.SetNotificationRepository(nil)
		helpers.SetActivityLogRepository(nil)
	})

	feedingService := services.NewFeedingLogService(feedingRepo, &storeFishBatchRepository{store: store})
	notificationService := services.NewNotificationService(notificationRepo)
	activityService := services.NewActivityLogService(activityRepo)
	trackingService := services.NewTrackingService(&storeFishBatchRepository{store: store})
	dashboardService := services.NewDashboardService(dashboardRepo)
	reportService := services.NewReportService(reportRepo)
	exportService := services.NewExportService(reportService)

	feedingHandler := handlers.NewFeedingLogHandler(feedingService)
	notificationHandler := handlers.NewNotificationHandler(notificationService)
	activityHandler := handlers.NewActivityLogHandler(activityService)
	trackingHandler := handlers.NewTrackingHandler(trackingService)
	dashboardHandler := handlers.NewDashboardHandler(dashboardService)
	reportHandler := handlers.NewReportHandler(reportService, exportService)

	logs := router.Group("/api/feeding-logs")
	logs.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff"))
	logs.POST("", feedingHandler.Create)
	logs.GET("", feedingHandler.GetAll)
	logs.GET("/:id", feedingHandler.GetByID)
	logs.PUT("/:id", feedingHandler.Update)
	logs.DELETE("/:id", middleware.RoleMiddleware("admin"), feedingHandler.Delete)

	notifications := router.Group("/api/notifications")
	notifications.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff", "customer"))
	notifications.GET("", notificationHandler.GetAll)
	notifications.GET("/unread", notificationHandler.GetUnread)
	notifications.PUT("/read-all", notificationHandler.MarkAllAsRead)
	notifications.PUT("/:id/read", notificationHandler.MarkAsRead)
	notifications.DELETE("/:id", notificationHandler.Delete)

	activityLogs := router.Group("/api/activity-logs")
	activityLogs.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin"))
	activityLogs.GET("", activityHandler.GetAll)
	activityLogs.GET("/:id", activityHandler.GetByID)

	dashboard := router.Group("/api/dashboard")
	dashboard.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff"))
	dashboard.GET("", dashboardHandler.GetSummary)
	dashboard.GET("/production", dashboardHandler.GetProduction)
	dashboard.GET("/harvest", dashboardHandler.GetHarvest)
	dashboard.GET("/feed", dashboardHandler.GetFeed)
	dashboard.GET("/batch-status", dashboardHandler.GetBatchStatus)
	dashboard.GET("/recent-harvest", dashboardHandler.GetRecentHarvest)

	reports := router.Group("/api/reports")
	reports.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff"))
	reports.GET("/harvest", reportHandler.GetHarvestReport)
	reports.GET("/production", reportHandler.GetProductionReport)
	reports.GET("/feeding", reportHandler.GetFeedingReport)
	reports.GET("/export/excel", reportHandler.ExportExcel)
	reports.GET("/export/pdf", reportHandler.ExportPDF)

	router.GET("/api/tracking/:batchCode", trackingHandler.GetByBatchCode)

	return store, router
}

func createIntegrationPond(t *testing.T, router *gin.Engine, token, name string) uint {
	t.Helper()
	recorder := performJSONRequest(t, router, http.MethodPost, "/api/ponds", map[string]interface{}{
		"name":        name,
		"location":    "Blok Timur",
		"capacity":    5000,
		"area":        100,
		"water_type":  "freshwater",
		"description": "Pond for integration test",
	}, token)
	require.Equal(t, http.StatusCreated, recorder.Code)
	var response apiResponseEnvelope
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &response))
	return uint(response.Data.(map[string]interface{})["id"].(float64))
}

func createIntegrationBatch(t *testing.T, router *gin.Engine, token string, pondID uint, fishType string) uint {
	t.Helper()
	recorder := performJSONRequest(t, router, http.MethodPost, "/api/batches", map[string]interface{}{
		"pond_id":          pondID,
		"fish_type":        fishType,
		"seed_count":       1000,
		"average_weight":   0.05,
		"start_date":       "2026-08-01",
		"expected_harvest": "2026-12-01",
	}, token)
	require.Equal(t, http.StatusCreated, recorder.Code)
	var response apiResponseEnvelope
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &response))
	return uint(response.Data.(map[string]interface{})["id"].(float64))
}
