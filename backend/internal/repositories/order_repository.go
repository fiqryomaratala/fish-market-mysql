package repositories

import (
	"errors"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type OrderFilter struct {
	Page   int
	Limit  int
	UserID uint
}

type OrderRepository interface {
	Create(order *models.Order) error
	CreateItems(items []models.OrderItem) error
	CountByYear(year int) (int64, error)
	FindAll(filter OrderFilter) ([]models.Order, int64, error)
	FindByID(id uint) (*models.Order, error)
	Update(order *models.Order) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) CreateItems(items []models.OrderItem) error {
	return r.db.Create(&items).Error
}

func (r *orderRepository) CountByYear(year int) (int64, error) {
	var total int64
	err := r.db.Model(&models.Order{}).
		Where("YEAR(created_at) = ?", year).
		Count(&total).Error

	return total, err
}

func (r *orderRepository) FindAll(filter OrderFilter) ([]models.Order, int64, error) {
	var (
		items []models.Order
		total int64
	)

	query := r.db.Model(&models.Order{}).Preload("User").Preload("OrderItems").Preload("OrderItems.Product")
	if filter.UserID > 0 {
		query = query.Where("user_id = ?", filter.UserID)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (filter.Page - 1) * filter.Limit
	if err := query.Order("created_at DESC").Offset(offset).Limit(filter.Limit).Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

func (r *orderRepository) FindByID(id uint) (*models.Order, error) {
	var item models.Order
	err := r.db.Preload("User").Preload("OrderItems").Preload("OrderItems.Product").First(&item, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &item, nil
}

func (r *orderRepository) Update(order *models.Order) error {
	return r.db.Save(order).Error
}
