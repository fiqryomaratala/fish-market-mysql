package services

import (
	"errors"
	"mime/multipart"
	"strings"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
)

var ErrProductNotFound = errors.New("product not found")

type ProductListParams struct {
	Search   string
	Category string
	Page     int
	Limit    int
}

type ProductListResult struct {
	Products []models.Product
	Total    int64
	Page     int
	Limit    int
}

type CreateProductInput struct {
	Name        string
	Description string
	Price       float64
	Stock       int
	Category    string
	Image       *multipart.FileHeader
	Audit       *AuditContext
}

type UpdateProductInput struct {
	Name        string
	Description string
	Price       float64
	Stock       int
	Category    string
	Image       *multipart.FileHeader
	Audit       *AuditContext
}

type ProductService interface {
	Create(input CreateProductInput) (*models.Product, error)
	GetAll(params ProductListParams) (*ProductListResult, error)
	GetByID(id uint) (*models.Product, error)
	Update(id uint, input UpdateProductInput) (*models.Product, error)
	Delete(id uint, audit *AuditContext) error
}

type productService struct {
	productRepo repositories.ProductRepository
	uploadDir   string
}

func NewProductService(productRepo repositories.ProductRepository, uploadDir string) ProductService {
	return &productService{
		productRepo: productRepo,
		uploadDir:   uploadDir,
	}
}

func (s *productService) Create(input CreateProductInput) (*models.Product, error) {
	imageURL, err := helpers.SaveUploadedProductImage(input.Image, s.uploadDir)
	if err != nil {
		logger.Error("failed to save product image", err, zap.String("module", "PRODUCT"))
		return nil, err
	}

	product := &models.Product{
		Name:        strings.TrimSpace(input.Name),
		Description: strings.TrimSpace(input.Description),
		Price:       input.Price,
		Stock:       input.Stock,
		Category:    strings.TrimSpace(input.Category),
		ImageURL:    imageURL,
		Status:      "active",
	}

	if err := s.productRepo.Create(product); err != nil {
		_ = helpers.DeleteUploadedFile(imageURL)
		logger.Error("failed to create product", err, zap.String("module", "PRODUCT"), zap.String("name", product.Name))
		return nil, err
	}

	if input.Audit != nil {
		helpers.LogActivity(input.Audit.UserID, "CREATE", "PRODUCT", "Membuat produk "+product.Name, input.Audit.IPAddress, input.Audit.UserAgent)
	}

	logger.Info("product created", zap.String("module", "PRODUCT"), zap.Uint("product_id", product.ID), zap.String("name", product.Name))

	return product, nil
}

func (s *productService) GetAll(params ProductListParams) (*ProductListResult, error) {
	products, total, err := s.productRepo.FindAll(repositories.ProductFilter{
		Search:   params.Search,
		Category: params.Category,
		Page:     params.Page,
		Limit:    params.Limit,
	})
	if err != nil {
		return nil, err
	}

	return &ProductListResult{
		Products: products,
		Total:    total,
		Page:     params.Page,
		Limit:    params.Limit,
	}, nil
}

func (s *productService) GetByID(id uint) (*models.Product, error) {
	product, err := s.productRepo.FindByID(id)
	if err != nil {
		logger.Error("failed to find product before update", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", id))
		return nil, err
	}
	if product == nil {
		return nil, ErrProductNotFound
	}

	return product, nil
}

func (s *productService) Update(id uint, input UpdateProductInput) (*models.Product, error) {
	product, err := s.productRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if product == nil {
		return nil, ErrProductNotFound
	}

	oldImageURL := product.ImageURL
	if input.Image != nil {
		newImageURL, err := helpers.SaveUploadedProductImage(input.Image, s.uploadDir)
		if err != nil {
			logger.Error("failed to save updated product image", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", id))
			return nil, err
		}
		product.ImageURL = newImageURL
	}

	product.Name = strings.TrimSpace(input.Name)
	product.Description = strings.TrimSpace(input.Description)
	product.Price = input.Price
	product.Stock = input.Stock
	product.Category = strings.TrimSpace(input.Category)

	if err := s.productRepo.Update(product); err != nil {
		if input.Image != nil && product.ImageURL != "" && product.ImageURL != oldImageURL {
			_ = helpers.DeleteUploadedFile(product.ImageURL)
			product.ImageURL = oldImageURL
		}
		logger.Error("failed to update product", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", product.ID))
		return nil, err
	}

	if input.Image != nil && oldImageURL != "" && oldImageURL != product.ImageURL {
		_ = helpers.DeleteUploadedFile(oldImageURL)
	}

	if input.Audit != nil {
		helpers.LogActivity(input.Audit.UserID, "UPDATE", "PRODUCT", "Memperbarui produk "+product.Name, input.Audit.IPAddress, input.Audit.UserAgent)
	}

	logger.Info("product updated", zap.String("module", "PRODUCT"), zap.Uint("product_id", product.ID), zap.String("name", product.Name))

	return product, nil
}

func (s *productService) Delete(id uint, audit *AuditContext) error {
	product, err := s.productRepo.FindByID(id)
	if err != nil {
		logger.Error("failed to find product before delete", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", id))
		return err
	}
	if product == nil {
		return ErrProductNotFound
	}

	if err := s.productRepo.Delete(product); err != nil {
		logger.Error("failed to delete product", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", product.ID))
		return err
	}

	if product.ImageURL != "" {
		_ = helpers.DeleteUploadedFile(product.ImageURL)
	}

	if audit != nil {
		helpers.LogActivity(audit.UserID, "DELETE", "PRODUCT", "Menghapus produk "+product.Name, audit.IPAddress, audit.UserAgent)
	}

	logger.Info("product deleted", zap.String("module", "PRODUCT"), zap.Uint("product_id", product.ID), zap.String("name", product.Name))

	return nil
}
