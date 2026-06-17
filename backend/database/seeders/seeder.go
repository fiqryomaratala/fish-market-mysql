package seeders

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/fiqryomaratala/backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	productFishNames = []string{"Nila", "Lele", "Patin", "Gurame", "Bawal", "Bandeng"}
	pondNames        = []string{"Kolam A", "Kolam B", "Kolam C", "Kolam D", "Kolam E"}
	feedTypes        = []string{"Pelet PF-1000", "Pelet PF-800", "Pelet Apung", "Pelet Tenggelam", "Pakan Organik"}
	batchStatuses    = []string{"active", "harvested"}
	notifTypes       = []string{"ORDER", "HARVEST", "INVENTORY", "BATCH"}
	actions          = []string{"CREATE", "UPDATE", "DELETE", "LOGIN"}
	modules          = []string{"PRODUCT", "ORDER", "HARVEST", "POND", "INVENTORY"}
	orderStatuses    = []string{"pending", "processing", "completed", "cancelled"}
	paymentStatuses  = []string{"paid", "unpaid"}
)

func RunSeeder(db *gorm.DB) error {
	gofakeit.Seed(20260801)

	return db.Transaction(func(tx *gorm.DB) error {
		steps := []struct {
			name string
			fn   func(*gorm.DB) error
		}{
			{"Users", SeedUsers},
			{"Products", SeedProducts},
			{"Ponds", SeedPonds},
			{"Fish Batches", SeedFishBatches},
			{"Feeding Logs", SeedFeedingLogs},
			{"Harvests", SeedHarvests},
			{"Inventories", SeedInventories},
			{"Notifications", SeedNotifications},
			{"Activity Logs", SeedActivityLogs},
			{"Orders", SeedOrders},
		}

		for _, step := range steps {
			fmt.Printf("Seeding %s...\n", step.name)
			if err := step.fn(tx); err != nil {
				return fmt.Errorf("seed %s failed: %w", step.name, err)
			}
			fmt.Println("Done.")
		}

		return nil
	})
}

func SeedUsers(tx *gorm.DB) error {
	var count int64
	if err := tx.Model(&models.User{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	users := make([]models.User, 0, 24)

	adminPassword, err := hashPassword("password123")
	if err != nil {
		return err
	}
	users = append(users, models.User{
		Name:     "Admin Fish Market",
		Email:    "admin@fishmarket.com",
		Password: adminPassword,
		Role:     "admin",
	})

	for i := 1; i <= 3; i++ {
		password, err := hashPassword("password123")
		if err != nil {
			return err
		}
		users = append(users, models.User{
			Name:     fmt.Sprintf("Staff %d", i),
			Email:    fmt.Sprintf("staff%d@fishmarket.com", i),
			Password: password,
			Role:     "staff",
		})
	}

	for i := 1; i <= 20; i++ {
		password, err := hashPassword("password123")
		if err != nil {
			return err
		}
		users = append(users, models.User{
			Name:     gofakeit.Name(),
			Email:    fmt.Sprintf("customer%d@fishmarket.com", i),
			Password: password,
			Role:     "customer",
		})
	}

	return tx.Create(&users).Error
}

func SeedProducts(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.Product{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	products := make([]models.Product, 0, 20)
	for i := 0; i < 20; i++ {
		fishName := productFishNames[i%len(productFishNames)]
		products = append(products, models.Product{
			Name:        fishName + " Premium " + strings.ToUpper(gofakeit.LetterN(2)),
			Description: "Produk ikan segar " + fishName + " berkualitas tinggi.",
			Price:       float64(gofakeit.Number(18000, 125000)),
			Stock:       gofakeit.Number(10, 200),
			Category:    fishName,
			Weight:      float64(gofakeit.Number(500, 5000)) / 1000,
			ImageURL:    fmt.Sprintf("https://dummyimage.com/600x400/0ea5e9/ffffff&text=%s", fishName),
			Status:      "available",
		})
	}

	return tx.Omit("FishBatchID").Create(&products).Error
}

func SeedPonds(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.Pond{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	ponds := make([]models.Pond, 0, len(pondNames))
	for index, name := range pondNames {
		ponds = append(ponds, models.Pond{
			Name:        name,
			Location:    fmt.Sprintf("Blok %s", string(rune('A'+index))),
			Capacity:    gofakeit.Number(1000, 10000),
			Area:        float64(gofakeit.Number(50, 250)),
			WaterType:   []string{"freshwater", "brackish"}[index%2],
			Status:      "active",
			Description: "Kolam budidaya untuk pembesaran ikan.",
		})
	}

	return tx.Create(&ponds).Error
}

func SeedFishBatches(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.FishBatch{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	var ponds []models.Pond
	if err := tx.Find(&ponds).Error; err != nil {
		return err
	}
	if len(ponds) == 0 {
		return nil
	}

	batches := make([]models.FishBatch, 0, 15)
	for i := 1; i <= 15; i++ {
		pond := ponds[(i-1)%len(ponds)]
		seedCount := gofakeit.Number(500, 3000)
		status := batchStatuses[gofakeit.Number(0, len(batchStatuses)-1)]
		currentCount := seedCount
		if status == "harvested" {
			currentCount = gofakeit.Number(int(math.Max(float64(seedCount/2), 1)), seedCount)
		}

		startDate := randomDate(time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC), time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC))
		expectedHarvest := startDate.AddDate(0, gofakeit.Number(3, 5), gofakeit.Number(0, 15))

		batches = append(batches, models.FishBatch{
			BatchCode:       fmt.Sprintf("BTCH-2026-%04d", i),
			PondID:          pond.ID,
			FishType:        productFishNames[(i-1)%len(productFishNames)],
			SeedCount:       seedCount,
			CurrentCount:    currentCount,
			AverageWeight:   float64(gofakeit.Number(5, 120)) / 100,
			StartDate:       startDate,
			ExpectedHarvest: expectedHarvest,
			Status:          status,
		})
	}

	if err := tx.Create(&batches).Error; err != nil {
		return err
	}

	var products []models.Product
	if err := tx.Find(&products).Error; err != nil {
		return err
	}

	for i := range products {
		products[i].FishBatchID = batches[i%len(batches)].ID
		if err := tx.Save(&products[i]).Error; err != nil {
			return err
		}
	}

	return nil
}

func SeedFeedingLogs(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.FeedingLog{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	var batches []models.FishBatch
	if err := tx.Find(&batches).Error; err != nil {
		return err
	}
	if len(batches) == 0 {
		return nil
	}

	logs := make([]models.FeedingLog, 0, 100)
	for i := 0; i < 100; i++ {
		batch := batches[gofakeit.Number(0, len(batches)-1)]
		logs = append(logs, models.FeedingLog{
			FishBatchID: batch.ID,
			FeedType:    feedTypes[gofakeit.Number(0, len(feedTypes)-1)],
			FeedAmount:  float64(gofakeit.Number(5, 50)),
			FeedTime:    randomDate(batch.StartDate, batch.ExpectedHarvest),
			Notes:       gofakeit.Sentence(6),
		})
	}

	return tx.Create(&logs).Error
}

func SeedHarvests(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.Harvest{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	var batches []models.FishBatch
	if err := tx.Where("status = ?", "harvested").Find(&batches).Error; err != nil {
		return err
	}
	if len(batches) == 0 {
		if err := tx.Find(&batches).Error; err != nil {
			return err
		}
	}
	if len(batches) == 0 {
		return nil
	}

	harvests := make([]models.Harvest, 0, 10)
	for i := 0; i < 10; i++ {
		batch := batches[i%len(batches)]
		harvestDate := randomDate(batch.StartDate.AddDate(0, 2, 0), batch.ExpectedHarvest.AddDate(0, 1, 0))
		fishCount := gofakeit.Number(int(math.Max(float64(batch.SeedCount/2), 1)), batch.SeedCount)
		totalWeight := float64(gofakeit.Number(100, 1200))
		harvests = append(harvests, models.Harvest{
			FishBatchID:   batch.ID,
			HarvestDate:   harvestDate,
			TotalWeight:   totalWeight,
			FishCount:     fishCount,
			AverageWeight: totalWeight / float64(fishCount),
			Notes:         "Panen batch " + batch.BatchCode,
		})
	}

	return tx.Create(&harvests).Error
}

func SeedInventories(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.Inventory{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	var products []models.Product
	if err := tx.Find(&products).Error; err != nil {
		return err
	}
	if len(products) == 0 {
		return nil
	}

	var batches []models.FishBatch
	if err := tx.Find(&batches).Error; err != nil {
		return err
	}

	inventories := make([]models.Inventory, 0, len(products))
	for i, product := range products {
		inventory := models.Inventory{
			ProductID: product.ID,
			Quantity:  float64(gofakeit.Number(20, 500)),
			Unit:      "kg",
			Status:    "available",
		}
		if len(batches) > 0 {
			inventory.FishBatchID = batches[i%len(batches)].ID
		}
		inventories = append(inventories, inventory)
	}

	return tx.Create(&inventories).Error
}

func SeedNotifications(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.Notification{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	var users []models.User
	if err := tx.Find(&users).Error; err != nil {
		return err
	}
	if len(users) == 0 {
		return nil
	}

	notifications := make([]models.Notification, 0, 30)
	for i := 0; i < 30; i++ {
		user := users[gofakeit.Number(0, len(users)-1)]
		notifType := notifTypes[gofakeit.Number(0, len(notifTypes)-1)]
		notifications = append(notifications, models.Notification{
			UserID:        user.ID,
			Title:         strings.Title(strings.ToLower(strings.ReplaceAll(notifType, "_", " "))),
			Message:       gofakeit.Sentence(8),
			Type:          notifType,
			ReferenceType: notifType,
			ReferenceID:   uint(gofakeit.Number(1, 20)),
			IsRead:        gofakeit.Bool(),
		})
	}

	return tx.Create(&notifications).Error
}

func SeedActivityLogs(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.ActivityLog{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	var users []models.User
	if err := tx.Find(&users).Error; err != nil {
		return err
	}
	if len(users) == 0 {
		return nil
	}

	logs := make([]models.ActivityLog, 0, 50)
	for i := 0; i < 50; i++ {
		user := users[gofakeit.Number(0, len(users)-1)]
		action := actions[gofakeit.Number(0, len(actions)-1)]
		module := modules[gofakeit.Number(0, len(modules)-1)]
		logs = append(logs, models.ActivityLog{
			UserID:      user.ID,
			Action:      action,
			Module:      module,
			Description: gofakeit.Sentence(10),
			IPAddress:   gofakeit.IPv4Address(),
			UserAgent:   gofakeit.UserAgent(),
		})
	}

	return tx.Create(&logs).Error
}

func SeedOrders(tx *gorm.DB) error {
	exists, err := hasRecords(tx, &models.Order{})
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	var customers []models.User
	if err := tx.Where("role = ?", "customer").Find(&customers).Error; err != nil {
		return err
	}
	var products []models.Product
	if err := tx.Find(&products).Error; err != nil {
		return err
	}
	if len(customers) == 0 || len(products) == 0 {
		return nil
	}

	orders := make([]models.Order, 0, 15)
	orderItems := make([]models.OrderItem, 0, 45)

	for i := 1; i <= 15; i++ {
		customer := customers[(i-1)%len(customers)]
		status := orderStatuses[gofakeit.Number(0, len(orderStatuses)-1)]
		paymentStatus := paymentStatuses[gofakeit.Number(0, len(paymentStatuses)-1)]
		order := models.Order{
			UserID:          customer.ID,
			InvoiceNumber:   fmt.Sprintf("INV-2026-%06d", i),
			Status:          status,
			PaymentStatus:   paymentStatus,
			ShippingAddress: gofakeit.Address().Address,
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		totalPrice := 0.0
		itemCount := gofakeit.Number(1, 3)
		for j := 0; j < itemCount; j++ {
			product := products[gofakeit.Number(0, len(products)-1)]
			quantity := gofakeit.Number(1, 5)
			subtotal := float64(quantity) * product.Price
			totalPrice += subtotal

			orderItems = append(orderItems, models.OrderItem{
				OrderID:   order.ID,
				ProductID: product.ID,
				Quantity:  quantity,
				Price:     product.Price,
				Subtotal:  subtotal,
			})
		}

		order.TotalPrice = totalPrice
		if err := tx.Save(&order).Error; err != nil {
			return err
		}
		orders = append(orders, order)
	}

	return tx.Create(&orderItems).Error
}

func hasRecords(tx *gorm.DB, model interface{}) (bool, error) {
	var count int64
	if err := tx.Model(model).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func hashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashed), nil
}

func randomDate(start, end time.Time) time.Time {
	if end.Before(start) {
		end = start.AddDate(0, 1, 0)
	}

	return gofakeit.DateRange(start, end)
}
