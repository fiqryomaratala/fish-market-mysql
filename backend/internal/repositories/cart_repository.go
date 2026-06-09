package repositories

import (
	"errors"

	"github.com/fiqryomaratala/backend/internal/models"
	"gorm.io/gorm"
)

type CartRepository interface {
	Create(cart *models.Cart) error
	FindByUserID(userID uint) ([]models.Cart, error)
	FindByID(id uint) (*models.Cart, error)
	FindByUserAndProduct(userID, productID uint) (*models.Cart, error)
	Update(cart *models.Cart) error
	Delete(cart *models.Cart) error
	DeleteByUserID(userID uint) error
}

type cartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) CartRepository {
	return &cartRepository{db: db}
}

func (r *cartRepository) Create(cart *models.Cart) error {
	return r.db.Create(cart).Error
}

func (r *cartRepository) FindByUserID(userID uint) ([]models.Cart, error) {
	var items []models.Cart
	err := r.db.Preload("Product").Where("user_id = ?", userID).Order("created_at DESC").Find(&items).Error
	return items, err
}

func (r *cartRepository) FindByID(id uint) (*models.Cart, error) {
	var item models.Cart
	err := r.db.Preload("Product").First(&item, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &item, nil
}

func (r *cartRepository) FindByUserAndProduct(userID, productID uint) (*models.Cart, error) {
	var item models.Cart
	err := r.db.Where("user_id = ? AND product_id = ?", userID, productID).First(&item).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &item, nil
}

func (r *cartRepository) Update(cart *models.Cart) error {
	return r.db.Save(cart).Error
}

func (r *cartRepository) Delete(cart *models.Cart) error {
	return r.db.Delete(cart).Error
}

func (r *cartRepository) DeleteByUserID(userID uint) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.Cart{}).Error
}
