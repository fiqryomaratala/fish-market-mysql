package services

import (
	"errors"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
)

var ErrCartItemNotFound = errors.New("cart item not found")
var ErrInsufficientInventory = errors.New("inventory is not enough")

type AddToCartInput struct {
	UserID    uint
	ProductID uint
	Quantity  int
}

type UpdateCartInput struct {
	UserID   uint
	Quantity int
}

type CartService interface {
	Add(input AddToCartInput) (*dto.CartResponse, error)
	GetByUserID(userID uint) (*dto.CartResponse, error)
	Update(cartID uint, input UpdateCartInput) (*dto.CartResponse, error)
	Delete(cartID uint, userID uint) error
	Clear(userID uint) error
}

type cartService struct {
	cartRepo      repositories.CartRepository
	productRepo   repositories.ProductRepository
	inventoryRepo repositories.InventoryRepository
}

func NewCartService(
	cartRepo repositories.CartRepository,
	productRepo repositories.ProductRepository,
	inventoryRepo repositories.InventoryRepository,
) CartService {
	return &cartService{
		cartRepo:      cartRepo,
		productRepo:   productRepo,
		inventoryRepo: inventoryRepo,
	}
}

func (s *cartService) Add(input AddToCartInput) (*dto.CartResponse, error) {
	product, err := s.productRepo.FindByID(input.ProductID)
	if err != nil {
		return nil, err
	}
	if product == nil {
		return nil, ErrProductNotFound
	}

	existing, err := s.cartRepo.FindByUserAndProduct(input.UserID, input.ProductID)
	if err != nil {
		return nil, err
	}

	newQuantity := input.Quantity
	if existing != nil {
		newQuantity += existing.Quantity
	}

	if err := s.validateInventory(product.ID, newQuantity); err != nil {
		return nil, err
	}

	if existing != nil {
		existing.Quantity = newQuantity
		if err := s.cartRepo.Update(existing); err != nil {
			return nil, err
		}
	} else {
		if err := s.cartRepo.Create(&models.Cart{
			UserID:    input.UserID,
			ProductID: input.ProductID,
			Quantity:  input.Quantity,
		}); err != nil {
			return nil, err
		}
	}

	return s.GetByUserID(input.UserID)
}

func (s *cartService) GetByUserID(userID uint) (*dto.CartResponse, error) {
	items, err := s.cartRepo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	response := &dto.CartResponse{
		Items:      make([]dto.CartItem, 0, len(items)),
		TotalPrice: 0,
	}

	for _, item := range items {
		if item.Product.ID == 0 || item.Product.Status == "hidden" {
			itemToDelete := item
			if err := s.cartRepo.Delete(&itemToDelete); err != nil {
				return nil, err
			}
			continue
		}

		subtotal := float64(item.Quantity) * item.Product.Price
		response.Items = append(response.Items, dto.CartItem{
			ID: item.ID,
			Product: dto.CartProductItem{
				ID:    item.Product.ID,
				Name:  item.Product.Name,
				Price: item.Product.Price,
			},
			Quantity: item.Quantity,
			Subtotal: subtotal,
		})
		response.TotalPrice += subtotal
	}

	return response, nil
}

func (s *cartService) Update(cartID uint, input UpdateCartInput) (*dto.CartResponse, error) {
	item, err := s.cartRepo.FindByID(cartID)
	if err != nil {
		return nil, err
	}
	if item == nil || item.UserID != input.UserID {
		return nil, ErrCartItemNotFound
	}
	if item.Product.ID == 0 || item.Product.Status == "hidden" {
		if err := s.cartRepo.Delete(item); err != nil {
			return nil, err
		}
		return nil, ErrCartItemNotFound
	}

	if err := s.validateInventory(item.ProductID, input.Quantity); err != nil {
		return nil, err
	}

	item.Quantity = input.Quantity
	if err := s.cartRepo.Update(item); err != nil {
		return nil, err
	}

	return s.GetByUserID(input.UserID)
}

func (s *cartService) Delete(cartID uint, userID uint) error {
	item, err := s.cartRepo.FindByID(cartID)
	if err != nil {
		return err
	}
	if item == nil || item.UserID != userID {
		return ErrCartItemNotFound
	}

	return s.cartRepo.Delete(item)
}

func (s *cartService) Clear(userID uint) error {
	return s.cartRepo.DeleteByUserID(userID)
}

func (s *cartService) validateInventory(productID uint, quantity int) error {
	total, err := s.inventoryRepo.GetTotalAvailableByProduct(productID)
	if err != nil {
		return err
	}
	if total < float64(quantity) {
		return ErrInsufficientInventory
	}
	return nil
}
