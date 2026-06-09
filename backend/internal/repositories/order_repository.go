package repositories

import (
	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *models.Order) error
	CreateItems(items []models.OrderItem) error
	CountByYear(year int) (int64, error)
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
