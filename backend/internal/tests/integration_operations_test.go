package tests

import (
	"encoding/json"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type integrationStore struct {
	mu                    sync.Mutex
	nextUserID            uint
	nextProductID         uint
	nextCartID            uint
	nextPondID            uint
	nextBatchID           uint
	nextHarvestID         uint
	nextInventoryID       uint
	nextInventoryTxID     uint
	nextOrderID           uint
	nextOrderItemID       uint
	nextFeedLogID         uint
	nextNotificationID    uint
	nextActivityLogID     uint
	users                 map[uint]*models.User
	products              map[uint]*models.Product
	carts                 map[uint]*models.Cart
	ponds                 map[uint]*models.Pond
	batches               map[uint]*models.FishBatch
	harvests              map[uint]*models.Harvest
	feedingLogs           map[uint]*models.FeedingLog
	inventories           map[uint]*models.Inventory
	inventoryTransactions map[uint]*models.InventoryTransaction
	notifications         map[uint]*models.Notification
	activityLogs          map[uint]*models.ActivityLog
	orders                map[uint]*models.Order
	orderItems            map[uint][]models.OrderItem
}

func newIntegrationStore(seedUsers ...*models.User) *integrationStore {
	store := &integrationStore{
		nextUserID:            1,
		nextProductID:         1,
		nextCartID:            1,
		nextPondID:            1,
		nextBatchID:           1,
		nextHarvestID:         1,
		nextInventoryID:       1,
		nextInventoryTxID:     1,
		nextOrderID:           1,
		nextOrderItemID:       1,
		nextFeedLogID:         1,
		nextNotificationID:    1,
		nextActivityLogID:     1,
		users:                 make(map[uint]*models.User),
		products:              make(map[uint]*models.Product),
		carts:                 make(map[uint]*models.Cart),
		ponds:                 make(map[uint]*models.Pond),
		batches:               make(map[uint]*models.FishBatch),
		harvests:              make(map[uint]*models.Harvest),
		feedingLogs:           make(map[uint]*models.FeedingLog),
		inventories:           make(map[uint]*models.Inventory),
		inventoryTransactions: make(map[uint]*models.InventoryTransaction),
		notifications:         make(map[uint]*models.Notification),
		activityLogs:          make(map[uint]*models.ActivityLog),
		orders:                make(map[uint]*models.Order),
		orderItems:            make(map[uint][]models.OrderItem),
	}

	for _, user := range seedUsers {
		cloned := cloneUser(user)
		if cloned.ID == 0 {
			cloned.ID = store.nextUserID
			store.nextUserID++
		}
		if cloned.ID >= store.nextUserID {
			store.nextUserID = cloned.ID + 1
		}
		store.users[cloned.ID] = cloned
	}

	return store
}

func (s *integrationStore) addProduct(product *models.Product) *models.Product {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now()
	cloned := cloneProduct(product)
	if cloned.ID == 0 {
		cloned.ID = s.nextProductID
		s.nextProductID++
	}
	if cloned.ID >= s.nextProductID {
		s.nextProductID = cloned.ID + 1
	}
	cloned.CreatedAt = now
	cloned.UpdatedAt = now
	s.products[cloned.ID] = cloned

	return cloneProduct(cloned)
}

func (s *integrationStore) linkProductToBatch(productID, batchID uint) {
	s.mu.Lock()
	defer s.mu.Unlock()

	product, ok := s.products[productID]
	if !ok {
		return
	}

	product.FishBatchID = batchID
	product.UpdatedAt = time.Now()
}

type storeProductRepository struct {
	store *integrationStore
}

func (r *storeProductRepository) Create(product *models.Product) error {
	created := r.store.addProduct(product)
	*product = *created
	return nil
}

func (r *storeProductRepository) FindAll(filter repositories.ProductFilter) ([]models.Product, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Product, 0)
	for _, product := range r.store.products {
		if filter.Search != "" {
			search := strings.ToLower(strings.TrimSpace(filter.Search))
			if !strings.Contains(strings.ToLower(product.Name), search) && !strings.Contains(strings.ToLower(product.Description), search) {
				continue
			}
		}
		if filter.Category != "" && product.Category != strings.TrimSpace(filter.Category) {
			continue
		}
		items = append(items, *cloneProduct(product))
	}

	return items, int64(len(items)), nil
}

func (r *storeProductRepository) FindByID(id uint) (*models.Product, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	product, ok := r.store.products[id]
	if !ok {
		return nil, nil
	}

	return cloneProduct(product), nil
}

func (r *storeProductRepository) FindByFishType(fishType string) (*models.Product, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	for _, product := range r.store.products {
		if product.FishBatchID == 0 {
			continue
		}
		batch, ok := r.store.batches[product.FishBatchID]
		if ok && strings.EqualFold(batch.FishType, strings.TrimSpace(fishType)) {
			return cloneProduct(product), nil
		}
	}

	return nil, nil
}

func (r *storeProductRepository) Update(product *models.Product) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.products[product.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	product.UpdatedAt = time.Now()
	r.store.products[product.ID] = cloneProduct(product)
	return nil
}

func (r *storeProductRepository) Delete(product *models.Product) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	delete(r.store.products, product.ID)
	return nil
}

type storeCartRepository struct {
	store *integrationStore
}

func (r *storeCartRepository) Create(cart *models.Cart) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	cart.ID = r.store.nextCartID
	r.store.nextCartID++
	cart.CreatedAt = time.Now()
	cart.UpdatedAt = cart.CreatedAt
	cloned := *cart
	r.store.carts[cart.ID] = &cloned
	return nil
}

func (r *storeCartRepository) FindByUserID(userID uint) ([]models.Cart, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Cart, 0)
	for _, cart := range r.store.carts {
		if cart.UserID != userID {
			continue
		}
		cloned := *cart
		if product, ok := r.store.products[cart.ProductID]; ok {
			cloned.Product = *cloneProduct(product)
		}
		items = append(items, cloned)
	}

	return items, nil
}

func (r *storeCartRepository) FindByID(id uint) (*models.Cart, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	cart, ok := r.store.carts[id]
	if !ok {
		return nil, nil
	}

	cloned := *cart
	if product, ok := r.store.products[cart.ProductID]; ok {
		cloned.Product = *cloneProduct(product)
	}

	return &cloned, nil
}

func (r *storeCartRepository) FindByUserAndProduct(userID, productID uint) (*models.Cart, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	for _, cart := range r.store.carts {
		if cart.UserID == userID && cart.ProductID == productID {
			cloned := *cart
			return &cloned, nil
		}
	}

	return nil, nil
}

func (r *storeCartRepository) Update(cart *models.Cart) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.carts[cart.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	cart.UpdatedAt = time.Now()
	cloned := *cart
	r.store.carts[cart.ID] = &cloned
	return nil
}

func (r *storeCartRepository) Delete(cart *models.Cart) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	delete(r.store.carts, cart.ID)
	return nil
}

func (r *storeCartRepository) DeleteByUserID(userID uint) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	for id, cart := range r.store.carts {
		if cart.UserID == userID {
			delete(r.store.carts, id)
		}
	}
	return nil
}

type storePondRepository struct {
	store *integrationStore
}

func (r *storePondRepository) Create(pond *models.Pond) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	pond.ID = r.store.nextPondID
	r.store.nextPondID++
	pond.CreatedAt = time.Now()
	pond.UpdatedAt = pond.CreatedAt
	cloned := *pond
	r.store.ponds[pond.ID] = &cloned
	return nil
}

func (r *storePondRepository) FindAll(filter repositories.PondFilter) ([]models.Pond, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Pond, 0)
	for _, pond := range r.store.ponds {
		if filter.Search != "" {
			search := strings.ToLower(strings.TrimSpace(filter.Search))
			if !strings.Contains(strings.ToLower(pond.Name), search) &&
				!strings.Contains(strings.ToLower(pond.Location), search) &&
				!strings.Contains(strings.ToLower(pond.Description), search) {
				continue
			}
		}
		items = append(items, *pond)
	}

	return items, int64(len(items)), nil
}

func (r *storePondRepository) FindByID(id uint) (*models.Pond, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	pond, ok := r.store.ponds[id]
	if !ok {
		return nil, nil
	}

	cloned := *pond
	return &cloned, nil
}

func (r *storePondRepository) Update(pond *models.Pond) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.ponds[pond.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	pond.UpdatedAt = time.Now()
	cloned := *pond
	r.store.ponds[pond.ID] = &cloned
	return nil
}

func (r *storePondRepository) Delete(pond *models.Pond) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	delete(r.store.ponds, pond.ID)
	return nil
}

type storeFishBatchRepository struct {
	store *integrationStore
}

func (r *storeFishBatchRepository) Create(batch *models.FishBatch) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	batch.ID = r.store.nextBatchID
	r.store.nextBatchID++
	batch.CreatedAt = time.Now()
	batch.UpdatedAt = batch.CreatedAt
	cloned := *batch
	if pond, ok := r.store.ponds[batch.PondID]; ok {
		cloned.Pond = *pond
	}
	r.store.batches[batch.ID] = &cloned
	return nil
}

func (r *storeFishBatchRepository) FindAll(filter repositories.FishBatchFilter) ([]models.FishBatch, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.FishBatch, 0)
	for _, batch := range r.store.batches {
		if filter.PondID > 0 && batch.PondID != filter.PondID {
			continue
		}
		if filter.FishType != "" && batch.FishType != filter.FishType {
			continue
		}
		if filter.Status != "" && batch.Status != filter.Status {
			continue
		}
		cloned := *batch
		if pond, ok := r.store.ponds[batch.PondID]; ok {
			cloned.Pond = *pond
		}
		items = append(items, cloned)
	}

	return items, int64(len(items)), nil
}

func (r *storeFishBatchRepository) FindByID(id uint) (*models.FishBatch, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	batch, ok := r.store.batches[id]
	if !ok {
		return nil, nil
	}

	cloned := *batch
	if pond, ok := r.store.ponds[batch.PondID]; ok {
		cloned.Pond = *pond
	}

	return &cloned, nil
}

func (r *storeFishBatchRepository) FindByBatchCode(batchCode string) (*models.FishBatch, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	for _, batch := range r.store.batches {
		if batch.BatchCode == batchCode {
			cloned := *batch
			if pond, ok := r.store.ponds[batch.PondID]; ok {
				cloned.Pond = *pond
			}
			cloned.FeedingLogs = make([]models.FeedingLog, 0)
			for _, log := range r.store.feedingLogs {
				if log.FishBatchID == batch.ID {
					cloned.FeedingLogs = append(cloned.FeedingLogs, *log)
				}
			}
			cloned.Harvests = make([]models.Harvest, 0)
			for _, harvest := range r.store.harvests {
				if harvest.FishBatchID == batch.ID {
					cloned.Harvests = append(cloned.Harvests, *harvest)
				}
			}
			return &cloned, nil
		}
	}

	return nil, nil
}

func (r *storeFishBatchRepository) Update(batch *models.FishBatch) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.batches[batch.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	batch.UpdatedAt = time.Now()
	cloned := *batch
	if pond, ok := r.store.ponds[batch.PondID]; ok {
		cloned.Pond = *pond
	}
	r.store.batches[batch.ID] = &cloned
	return nil
}

func (r *storeFishBatchRepository) Delete(batch *models.FishBatch) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	delete(r.store.batches, batch.ID)
	return nil
}

func (r *storeFishBatchRepository) CountByYear(year int) (int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	var total int64
	for _, batch := range r.store.batches {
		if batch.CreatedAt.Year() == year {
			total++
		}
	}
	return total, nil
}

type storeHarvestRepository struct {
	store *integrationStore
}

func (r *storeHarvestRepository) Create(harvest *models.Harvest) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	harvest.ID = r.store.nextHarvestID
	r.store.nextHarvestID++
	harvest.CreatedAt = time.Now()
	harvest.UpdatedAt = harvest.CreatedAt
	cloned := *harvest
	if batch, ok := r.store.batches[harvest.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	r.store.harvests[harvest.ID] = &cloned
	return nil
}

func (r *storeHarvestRepository) FindAll(filter repositories.HarvestFilter) ([]models.Harvest, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Harvest, 0)
	for _, harvest := range r.store.harvests {
		if filter.FishBatchID > 0 && harvest.FishBatchID != filter.FishBatchID {
			continue
		}
		if filter.StartDate != nil && harvest.HarvestDate.Before(*filter.StartDate) {
			continue
		}
		if filter.EndDate != nil && harvest.HarvestDate.After(*filter.EndDate) {
			continue
		}
		cloned := *harvest
		if batch, ok := r.store.batches[harvest.FishBatchID]; ok {
			cloned.FishBatch = *batch
		}
		items = append(items, cloned)
	}
	return items, int64(len(items)), nil
}

func (r *storeHarvestRepository) FindByID(id uint) (*models.Harvest, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	harvest, ok := r.store.harvests[id]
	if !ok {
		return nil, nil
	}
	cloned := *harvest
	if batch, ok := r.store.batches[harvest.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	return &cloned, nil
}

func (r *storeHarvestRepository) Update(harvest *models.Harvest) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.harvests[harvest.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	harvest.UpdatedAt = time.Now()
	cloned := *harvest
	if batch, ok := r.store.batches[harvest.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	r.store.harvests[harvest.ID] = &cloned
	return nil
}

func (r *storeHarvestRepository) Delete(harvest *models.Harvest) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	delete(r.store.harvests, harvest.ID)
	return nil
}

func (r *storeHarvestRepository) GetSummary() (*repositories.HarvestSummary, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	summary := &repositories.HarvestSummary{}
	for _, harvest := range r.store.harvests {
		summary.TotalHarvests++
		summary.TotalWeight += harvest.TotalWeight
		summary.TotalFish += int64(harvest.FishCount)
	}
	return summary, nil
}

type storeInventoryRepository struct {
	store *integrationStore
}

func (r *storeInventoryRepository) Create(inventory *models.Inventory) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	inventory.ID = r.store.nextInventoryID
	r.store.nextInventoryID++
	inventory.CreatedAt = time.Now()
	inventory.UpdatedAt = inventory.CreatedAt
	cloned := *inventory
	if product, ok := r.store.products[inventory.ProductID]; ok {
		cloned.Product = *cloneProduct(product)
	}
	if batch, ok := r.store.batches[inventory.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	r.store.inventories[inventory.ID] = &cloned
	return nil
}

func (r *storeInventoryRepository) FindAll(filter repositories.InventoryFilter) ([]models.Inventory, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Inventory, 0)
	for _, inventory := range r.store.inventories {
		if filter.ProductID > 0 && inventory.ProductID != filter.ProductID {
			continue
		}
		if filter.BatchID > 0 && inventory.FishBatchID != filter.BatchID {
			continue
		}
		cloned := *inventory
		if product, ok := r.store.products[inventory.ProductID]; ok {
			cloned.Product = *cloneProduct(product)
		}
		if batch, ok := r.store.batches[inventory.FishBatchID]; ok {
			cloned.FishBatch = *batch
		}
		items = append(items, cloned)
	}
	return items, int64(len(items)), nil
}

func (r *storeInventoryRepository) FindByID(id uint) (*models.Inventory, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	inventory, ok := r.store.inventories[id]
	if !ok {
		return nil, nil
	}
	cloned := *inventory
	if product, ok := r.store.products[inventory.ProductID]; ok {
		cloned.Product = *cloneProduct(product)
	}
	if batch, ok := r.store.batches[inventory.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	return &cloned, nil
}

func (r *storeInventoryRepository) FindByProductAndBatch(productID, batchID uint) (*models.Inventory, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	for _, inventory := range r.store.inventories {
		if inventory.ProductID == productID && inventory.FishBatchID == batchID {
			cloned := *inventory
			return &cloned, nil
		}
	}
	return nil, nil
}

func (r *storeInventoryRepository) FindAvailableByProduct(productID uint) ([]models.Inventory, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Inventory, 0)
	for _, inventory := range r.store.inventories {
		if inventory.ProductID == productID && inventory.Quantity > 0 {
			cloned := *inventory
			if product, ok := r.store.products[inventory.ProductID]; ok {
				cloned.Product = *cloneProduct(product)
			}
			if batch, ok := r.store.batches[inventory.FishBatchID]; ok {
				cloned.FishBatch = *batch
			}
			items = append(items, cloned)
		}
	}
	return items, nil
}

func (r *storeInventoryRepository) GetTotalAvailableByProduct(productID uint) (float64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	total := 0.0
	for _, inventory := range r.store.inventories {
		if inventory.ProductID == productID {
			total += inventory.Quantity
		}
	}
	return total, nil
}

func (r *storeInventoryRepository) Update(inventory *models.Inventory) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.inventories[inventory.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	inventory.UpdatedAt = time.Now()
	cloned := *inventory
	if product, ok := r.store.products[inventory.ProductID]; ok {
		cloned.Product = *cloneProduct(product)
	}
	if batch, ok := r.store.batches[inventory.FishBatchID]; ok {
		cloned.FishBatch = *batch
	}
	r.store.inventories[inventory.ID] = &cloned
	return nil
}

type storeInventoryTransactionRepository struct {
	store *integrationStore
}

func (r *storeInventoryTransactionRepository) Create(transaction *models.InventoryTransaction) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	transaction.ID = r.store.nextInventoryTxID
	r.store.nextInventoryTxID++
	transaction.CreatedAt = time.Now()
	transaction.UpdatedAt = transaction.CreatedAt
	cloned := *transaction
	if inventory, ok := r.store.inventories[transaction.InventoryID]; ok {
		cloned.Inventory = *inventory
	}
	r.store.inventoryTransactions[transaction.ID] = &cloned
	return nil
}

func (r *storeInventoryTransactionRepository) FindAll(filter repositories.InventoryTransactionFilter) ([]models.InventoryTransaction, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.InventoryTransaction, 0)
	for _, transaction := range r.store.inventoryTransactions {
		if filter.Type != "" && transaction.Type != filter.Type {
			continue
		}
		cloned := *transaction
		if inventory, ok := r.store.inventories[transaction.InventoryID]; ok {
			cloned.Inventory = *inventory
		}
		items = append(items, cloned)
	}
	return items, nil
}

type storeOrderRepository struct {
	store *integrationStore
}

func (r *storeOrderRepository) Create(order *models.Order) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	order.ID = r.store.nextOrderID
	r.store.nextOrderID++
	order.CreatedAt = time.Now()
	order.UpdatedAt = order.CreatedAt
	cloned := *order
	r.store.orders[order.ID] = &cloned
	return nil
}

func (r *storeOrderRepository) CreateItems(items []models.OrderItem) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	for index := range items {
		items[index].ID = r.store.nextOrderItemID
		r.store.nextOrderItemID++
		items[index].CreatedAt = time.Now()
		items[index].UpdatedAt = items[index].CreatedAt
		cloned := items[index]
		r.store.orderItems[items[index].OrderID] = append(r.store.orderItems[items[index].OrderID], cloned)
	}
	return nil
}

func (r *storeOrderRepository) CountByYear(year int) (int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	var total int64
	for _, order := range r.store.orders {
		if order.CreatedAt.Year() == year {
			total++
		}
	}
	return total, nil
}

func (r *storeOrderRepository) FindAll(filter repositories.OrderFilter) ([]models.Order, int64, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	items := make([]models.Order, 0)
	for _, order := range r.store.orders {
		if filter.UserID > 0 && order.UserID != filter.UserID {
			continue
		}
		cloned := *order
		if user, ok := r.store.users[order.UserID]; ok {
			cloned.User = *cloneUser(user)
		}
		orderItems := r.store.orderItems[order.ID]
		cloned.OrderItems = make([]models.OrderItem, 0, len(orderItems))
		for _, item := range orderItems {
			clonedItem := item
			if product, ok := r.store.products[item.ProductID]; ok {
				clonedItem.Product = *cloneProduct(product)
			}
			cloned.OrderItems = append(cloned.OrderItems, clonedItem)
		}
		items = append(items, cloned)
	}
	return items, int64(len(items)), nil
}

func (r *storeOrderRepository) FindByID(id uint) (*models.Order, error) {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	order, ok := r.store.orders[id]
	if !ok {
		return nil, nil
	}
	cloned := *order
	if user, ok := r.store.users[order.UserID]; ok {
		cloned.User = *cloneUser(user)
	}
	orderItems := r.store.orderItems[order.ID]
	cloned.OrderItems = make([]models.OrderItem, 0, len(orderItems))
	for _, item := range orderItems {
		clonedItem := item
		if product, ok := r.store.products[item.ProductID]; ok {
			clonedItem.Product = *cloneProduct(product)
		}
		cloned.OrderItems = append(cloned.OrderItems, clonedItem)
	}
	return &cloned, nil
}

func (r *storeOrderRepository) Update(order *models.Order) error {
	r.store.mu.Lock()
	defer r.store.mu.Unlock()

	if _, ok := r.store.orders[order.ID]; !ok {
		return gorm.ErrRecordNotFound
	}
	order.UpdatedAt = time.Now()
	cloned := *order
	r.store.orders[order.ID] = &cloned
	return nil
}

func TestIntegrationPondBatchHarvestInventoryFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	store, router := setupOperationsIntegrationRouter(t)
	staffToken := loginAndExtractToken(t, router, "staff1@fishmarket.com", "password123")
	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")

	pondRecorder := performJSONRequest(t, router, http.MethodPost, "/api/ponds", map[string]interface{}{
		"name":        "Kolam Integrasi",
		"location":    "Blok Timur",
		"capacity":    5000,
		"area":        100,
		"water_type":  "freshwater",
		"description": "Kolam untuk test integration",
	}, staffToken)
	require.Equal(t, http.StatusCreated, pondRecorder.Code)

	var pondResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(pondRecorder.Body.Bytes(), &pondResponse))
	pondData := pondResponse.Data.(map[string]interface{})
	pondID := uint(pondData["id"].(float64))

	batchRecorder := performJSONRequest(t, router, http.MethodPost, "/api/batches", map[string]interface{}{
		"pond_id":          pondID,
		"fish_type":        "Nila",
		"seed_count":       1000,
		"average_weight":   0.05,
		"start_date":       "2026-08-01",
		"expected_harvest": "2026-12-01",
	}, staffToken)
	require.Equal(t, http.StatusCreated, batchRecorder.Code)

	var batchResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(batchRecorder.Body.Bytes(), &batchResponse))
	batchData := batchResponse.Data.(map[string]interface{})
	batchID := uint(batchData["id"].(float64))
	assert.Equal(t, "active", batchData["status"])

	seedProduct := store.addProduct(&models.Product{
		Name:        "Produk Nila Panen",
		Description: "Digunakan untuk harvest integration test",
		Price:       45000,
		Stock:       20,
		Category:    "ikan konsumsi",
		Status:      "active",
	})
	store.linkProductToBatch(seedProduct.ID, batchID)

	harvestRecorder := performJSONRequest(t, router, http.MethodPost, "/api/harvests", map[string]interface{}{
		"fish_batch_id":  batchID,
		"harvest_date":   "2026-12-01",
		"total_weight":   850,
		"fish_count":     900,
		"average_weight": 0.94,
		"notes":          "Panen integration",
	}, staffToken)
	require.Equal(t, http.StatusCreated, harvestRecorder.Code)

	inventoryRecorder := performJSONRequest(t, router, http.MethodGet, "/api/inventory", nil, adminToken)
	require.Equal(t, http.StatusOK, inventoryRecorder.Code)
	assert.Contains(t, inventoryRecorder.Body.String(), "Produk Nila Panen")
	assert.Contains(t, inventoryRecorder.Body.String(), "BTCH-")

	txRecorder := performJSONRequest(t, router, http.MethodGet, "/api/inventory/transactions?type=IN", nil, adminToken)
	require.Equal(t, http.StatusOK, txRecorder.Code)
	assert.Contains(t, txRecorder.Body.String(), `"type":"IN"`)
	assert.Contains(t, txRecorder.Body.String(), `"reference":"`)

	summaryRecorder := performJSONRequest(t, router, http.MethodGet, "/api/harvests/summary", nil, adminToken)
	require.Equal(t, http.StatusOK, summaryRecorder.Code)
	assert.Contains(t, summaryRecorder.Body.String(), `"total_harvests":1`)
}

func TestIntegrationCartCheckoutOrderFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	store, router := setupOperationsIntegrationRouter(t)
	customerToken := loginAndExtractToken(t, router, "customer1@fishmarket.com", "password123")
	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")

	product := store.addProduct(&models.Product{
		Name:        "Ikan Lele Checkout",
		Description: "Untuk flow checkout",
		Price:       30000,
		Stock:       50,
		Category:    "ikan konsumsi",
		Status:      "active",
	})
	batch := &models.FishBatch{
		Model:           gorm.Model{ID: 1},
		BatchCode:       "BTCH-2026-0099",
		FishType:        "Lele",
		SeedCount:       1000,
		CurrentCount:    1000,
		AverageWeight:   0.2,
		StartDate:       time.Date(2026, 8, 1, 0, 0, 0, 0, time.UTC),
		ExpectedHarvest: time.Date(2026, 12, 1, 0, 0, 0, 0, time.UTC),
		Status:          "active",
	}
	store.batches[batch.ID] = batch
	store.linkProductToBatch(product.ID, batch.ID)

	storeInventoryRepo := &storeInventoryRepository{store: store}
	err := storeInventoryRepo.Create(&models.Inventory{
		ProductID:   product.ID,
		FishBatchID: batch.ID,
		Quantity:    25,
		Unit:        "kg",
		Status:      "available",
	})
	require.NoError(t, err)

	addCartRecorder := performJSONRequest(t, router, http.MethodPost, "/api/cart", map[string]interface{}{
		"product_id": product.ID,
		"quantity":   2,
	}, customerToken)
	require.Equal(t, http.StatusCreated, addCartRecorder.Code)
	assert.Contains(t, addCartRecorder.Body.String(), `"total_price":60000`)

	getCartRecorder := performJSONRequest(t, router, http.MethodGet, "/api/cart", nil, customerToken)
	require.Equal(t, http.StatusOK, getCartRecorder.Code)
	assert.Contains(t, getCartRecorder.Body.String(), "Ikan Lele Checkout")

	checkoutRecorder := performJSONRequest(t, router, http.MethodPost, "/api/checkout", map[string]interface{}{
		"shipping_address": "Jl. Laut 123",
	}, customerToken)
	require.Equal(t, http.StatusCreated, checkoutRecorder.Code)

	var checkoutResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(checkoutRecorder.Body.Bytes(), &checkoutResponse))
	checkoutData := checkoutResponse.Data.(map[string]interface{})
	invoice := checkoutData["invoice"].(string)
	require.NotEmpty(t, invoice)

	emptyCartRecorder := performJSONRequest(t, router, http.MethodGet, "/api/cart", nil, customerToken)
	require.Equal(t, http.StatusOK, emptyCartRecorder.Code)
	assert.Contains(t, emptyCartRecorder.Body.String(), `"items":[]`)

	customerOrdersRecorder := performJSONRequest(t, router, http.MethodGet, "/api/orders", nil, customerToken)
	require.Equal(t, http.StatusOK, customerOrdersRecorder.Code)
	assert.Contains(t, customerOrdersRecorder.Body.String(), invoice)

	var orderListResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(customerOrdersRecorder.Body.Bytes(), &orderListResponse))
	orderListData := orderListResponse.Data.(map[string]interface{})
	items := orderListData["items"].([]interface{})
	orderID := int(items[0].(map[string]interface{})["id"].(float64))

	orderDetailRecorder := performJSONRequest(t, router, http.MethodGet, "/api/orders/"+strconv.Itoa(orderID), nil, customerToken)
	require.Equal(t, http.StatusOK, orderDetailRecorder.Code)
	assert.Contains(t, orderDetailRecorder.Body.String(), `"status":"pending"`)

	paymentRecorder := performJSONRequest(t, router, http.MethodPut, "/api/orders/"+strconv.Itoa(orderID)+"/payment", map[string]interface{}{
		"payment_status": "paid",
	}, adminToken)
	require.Equal(t, http.StatusOK, paymentRecorder.Code)
	assert.Contains(t, paymentRecorder.Body.String(), `"payment_status":"paid"`)

	statusRecorder := performJSONRequest(t, router, http.MethodPut, "/api/orders/"+strconv.Itoa(orderID)+"/status", map[string]interface{}{
		"status": "completed",
	}, adminToken)
	require.Equal(t, http.StatusOK, statusRecorder.Code)
	assert.Contains(t, statusRecorder.Body.String(), `"status":"completed"`)

	invoiceRecorder := performJSONRequest(t, router, http.MethodGet, "/api/orders/"+strconv.Itoa(orderID)+"/invoice", nil, customerToken)
	require.Equal(t, http.StatusOK, invoiceRecorder.Code)
	assert.Equal(t, "application/pdf", invoiceRecorder.Header().Get("Content-Type"))

	txRecorder := performJSONRequest(t, router, http.MethodGet, "/api/inventory/transactions?type=OUT", nil, adminToken)
	require.Equal(t, http.StatusOK, txRecorder.Code)
	assert.Contains(t, txRecorder.Body.String(), `"type":"OUT"`)
	assert.Contains(t, txRecorder.Body.String(), invoice)
}

func setupOperationsIntegrationRouter(t *testing.T) (*integrationStore, *gin.Engine) {
	t.Helper()

	adminPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	require.NoError(t, err)
	staffPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	require.NoError(t, err)
	customerPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	require.NoError(t, err)

	store := newIntegrationStore(
		&models.User{Model: gorm.Model{ID: 1}, Name: "Admin", Email: "admin@fishmarket.com", Password: string(adminPassword), Role: "admin"},
		&models.User{Model: gorm.Model{ID: 2}, Name: "Staff", Email: "staff1@fishmarket.com", Password: string(staffPassword), Role: "staff"},
		&models.User{Model: gorm.Model{ID: 3}, Name: "Customer", Email: "customer1@fishmarket.com", Password: string(customerPassword), Role: "customer"},
	)

	userRepo := newIntegrationUserRepository(
		store.users[1],
		store.users[2],
		store.users[3],
	)
	productRepo := &storeProductRepository{store: store}
	cartRepo := &storeCartRepository{store: store}
	pondRepo := &storePondRepository{store: store}
	batchRepo := &storeFishBatchRepository{store: store}
	harvestRepo := &storeHarvestRepository{store: store}
	inventoryRepo := &storeInventoryRepository{store: store}
	inventoryTxRepo := &storeInventoryTransactionRepository{store: store}
	orderRepo := &storeOrderRepository{store: store}

	authService := services.NewAuthService(userRepo)
	cartService := services.NewCartService(cartRepo, productRepo, inventoryRepo)
	inventoryService := services.NewInventoryService(inventoryRepo, inventoryTxRepo, productRepo)
	checkoutService := services.NewCheckoutServiceWithDependencies(cartRepo, orderRepo, inventoryService)
	orderService := services.NewOrderService(orderRepo)
	pondService := services.NewPondService(pondRepo)
	batchService := services.NewFishBatchService(batchRepo, pondRepo)
	harvestService := services.NewHarvestService(harvestRepo, batchRepo, inventoryService)

	authHandler := handlers.NewAuthHandler(authService)
	cartHandler := handlers.NewCartHandler(cartService)
	checkoutHandler := handlers.NewCheckoutHandler(checkoutService)
	orderHandler := handlers.NewOrderHandler(orderService)
	pondHandler := handlers.NewPondHandler(pondService)
	batchHandler := handlers.NewFishBatchHandler(batchService)
	harvestHandler := handlers.NewHarvestHandler(harvestService)
	inventoryHandler := handlers.NewInventoryHandler(inventoryService)
	accessHandler := handlers.NewAccessHandler()

	router := gin.New()
	router.Use(middleware.RecoveryMiddleware())
	router.Static("/uploads", filepath.Join(t.TempDir(), "uploads"))

	auth := router.Group("/api/auth")
	auth.POST("/register", authHandler.Register)
	auth.POST("/login", authHandler.Login)
	auth.GET("/profile", middleware.AuthMiddleware(), authHandler.Profile)

	api := router.Group("/api")
	api.GET("/profile", middleware.AuthMiddleware(), authHandler.Profile)

	customer := router.Group("/api/customer")
	customer.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff", "customer"))
	customer.GET("/profile", authHandler.Profile)

	admin := router.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin"))
	admin.GET("/dashboard", accessHandler.AdminDashboard)

	cart := router.Group("/api/cart")
	cart.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("customer"))
	cart.POST("", cartHandler.Add)
	cart.GET("", cartHandler.GetAll)
	cart.PUT("/:id", cartHandler.Update)
	cart.DELETE("/:id", cartHandler.Delete)
	cart.DELETE("", cartHandler.Clear)

	checkout := router.Group("/api/checkout")
	checkout.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("customer"))
	checkout.POST("", checkoutHandler.Checkout)

	orders := router.Group("/api/orders")
	orders.Use(middleware.AuthMiddleware())
	orders.GET("", orderHandler.GetAll)
	orders.GET("/:id/invoice", orderHandler.GetInvoice)
	orders.GET("/:id", orderHandler.GetByID)
	orders.PUT("/:id/status", middleware.RoleMiddleware("admin"), orderHandler.UpdateStatus)
	orders.PUT("/:id/payment", middleware.RoleMiddleware("admin"), orderHandler.UpdatePayment)

	ponds := router.Group("/api/ponds")
	ponds.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff"))
	ponds.POST("", pondHandler.Create)
	ponds.GET("", pondHandler.GetAll)
	ponds.GET("/:id", pondHandler.GetByID)
	ponds.PUT("/:id", pondHandler.Update)
	ponds.DELETE("/:id", middleware.RoleMiddleware("admin"), pondHandler.Delete)

	batches := router.Group("/api/batches")
	batches.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff"))
	batches.POST("", batchHandler.Create)
	batches.GET("", batchHandler.GetAll)
	batches.GET("/:id", batchHandler.GetByID)
	batches.PUT("/:id", batchHandler.Update)
	batches.DELETE("/:id", middleware.RoleMiddleware("admin"), batchHandler.Delete)

	harvests := router.Group("/api/harvests")
	harvests.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff"))
	harvests.POST("", harvestHandler.Create)
	harvests.GET("", harvestHandler.GetAll)
	harvests.GET("/summary", harvestHandler.Summary)
	harvests.GET("/:id", harvestHandler.GetByID)
	harvests.PUT("/:id", harvestHandler.Update)
	harvests.DELETE("/:id", middleware.RoleMiddleware("admin"), harvestHandler.Delete)

	inventory := router.Group("/api/inventory")
	inventory.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff"))
	inventory.GET("", inventoryHandler.GetAll)
	inventory.GET("/transactions", middleware.RoleMiddleware("admin"), inventoryHandler.GetTransactions)
	inventory.POST("/adjustment", middleware.RoleMiddleware("admin"), inventoryHandler.Adjust)
	inventory.GET("/:id", inventoryHandler.GetByID)

	return store, router
}
