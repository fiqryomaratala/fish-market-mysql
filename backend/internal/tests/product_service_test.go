package tests

import (
	"testing"

	"github.com/fiqryomaratala/backend/internal/mocks"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/stretchr/testify/assert"
)

func TestProductServiceCreate(t *testing.T) {
	SetupTest(t)

	productRepo := &mocks.MockProductRepository{
		CreateFunc: func(product *models.Product) error {
			product.ID = 1
			return nil
		},
	}

	service := services.NewProductService(productRepo, "uploads/products")
	product, err := service.Create(services.CreateProductInput{
		Name:        " Ikan Nila ",
		Description: " Segar ",
		Price:       35000,
		Stock:       10,
		Category:    " Air Tawar ",
	})

	assert.NoError(t, err)
	assert.NotNil(t, product)
	assert.Equal(t, uint(1), product.ID)
	assert.Equal(t, "Ikan Nila", product.Name)
	assert.Equal(t, "Segar", product.Description)
	assert.Equal(t, "Air Tawar", product.Category)
	assert.Equal(t, "available", product.Status)
}

func TestProductServiceUpdate(t *testing.T) {
	SetupTest(t)

	existing := &models.Product{Model: models.Product{}.Model, Name: "Ikan Lama", Price: 10000, Stock: 5}
	productRepo := &mocks.MockProductRepository{
		FindByIDFunc: func(id uint) (*models.Product, error) {
			return existing, nil
		},
		UpdateFunc: func(product *models.Product) error {
			return nil
		},
	}

	service := services.NewProductService(productRepo, "uploads/products")
	product, err := service.Update(1, services.UpdateProductInput{
		Name:        "Ikan Baru",
		Description: "Deskripsi Baru",
		Price:       50000,
		Stock:       20,
		Category:    "Freshwater",
	})

	assert.NoError(t, err)
	assert.NotNil(t, product)
	assert.Equal(t, "Ikan Baru", product.Name)
	assert.Equal(t, float64(50000), product.Price)
	assert.Equal(t, 20, product.Stock)
}

func TestProductServiceDelete(t *testing.T) {
	SetupTest(t)

	deleted := false
	productRepo := &mocks.MockProductRepository{
		FindByIDFunc: func(id uint) (*models.Product, error) {
			return &models.Product{Model: models.Product{}.Model, Name: "Ikan Nila"}, nil
		},
		DeleteFunc: func(product *models.Product) error {
			deleted = true
			return nil
		},
	}

	service := services.NewProductService(productRepo, "uploads/products")
	err := service.Delete(1, nil)

	assert.NoError(t, err)
	assert.True(t, deleted)
}

func TestProductServiceGetByID(t *testing.T) {
	SetupTest(t)

	productRepo := &mocks.MockProductRepository{
		FindByIDFunc: func(id uint) (*models.Product, error) {
			return &models.Product{Model: models.Product{}.Model, Name: "Ikan Nila"}, nil
		},
	}

	service := services.NewProductService(productRepo, "uploads/products")
	product, err := service.GetByID(1)

	assert.NoError(t, err)
	assert.NotNil(t, product)
	assert.Equal(t, "Ikan Nila", product.Name)
}

func TestProductServiceGetAllProduct(t *testing.T) {
	SetupTest(t)

	productRepo := &mocks.MockProductRepository{
		FindAllFunc: func(filter repositories.ProductFilter) ([]models.Product, int64, error) {
			return []models.Product{
				{Name: "Nila"},
				{Name: "Lele"},
			}, 2, nil
		},
	}

	service := services.NewProductService(productRepo, "uploads/products")
	result, err := service.GetAll(services.ProductListParams{
		Page:  1,
		Limit: 10,
	})

	assert.NoError(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, int64(2), result.Total)
	assert.Len(t, result.Products, 2)
}

func TestProductServiceProductNotFound(t *testing.T) {
	SetupTest(t)

	productRepo := &mocks.MockProductRepository{
		FindByIDFunc: func(id uint) (*models.Product, error) {
			return nil, nil
		},
	}

	service := services.NewProductService(productRepo, "uploads/products")
	product, err := service.GetByID(999)

	assert.ErrorIs(t, err, services.ErrProductNotFound)
	assert.Nil(t, product)
}
