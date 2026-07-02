package services

import (
	"errors"
	"fmt"
	"mime/multipart"
	"strings"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/logger"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"go.uber.org/zap"
)

var ErrProductNotFound = errors.New("product not found")
var ErrInvalidProductCategory = errors.New("invalid product category")
var ErrProductHasRelations = errors.New("product still has related data")

type ProductListParams struct {
	Search      string
	Category    string
	Status      string
	AllowHidden bool
	Page        int
	Limit       int
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
	Weight      float64
	Status      string
	ImageURL    string
	Image       *multipart.FileHeader
	Audit       *AuditContext
}

type UpdateProductInput struct {
	Name        string
	Description string
	Price       float64
	Stock       int
	Category    string
	Weight      float64
	Status      string
	ImageURL    string
	Image       *multipart.FileHeader
	Audit       *AuditContext
}

type ProductService interface {
	Create(input CreateProductInput) (*models.Product, error)
	GetAll(params ProductListParams) (*ProductListResult, error)
	GetByID(id uint) (*models.Product, error)
	GetByIDIncludingHidden(id uint) (*models.Product, error)
	Update(id uint, input UpdateProductInput) (*models.Product, error)
	Delete(id uint, audit *AuditContext) error
}

type productService struct {
	productRepo   repositories.ProductRepository
	inventoryRepo repositories.InventoryRepository
	uploadDir     string
}

func NewProductService(
	productRepo repositories.ProductRepository,
	uploadDir string,
	inventoryRepo ...repositories.InventoryRepository,
) ProductService {
	var stockRepo repositories.InventoryRepository
	if len(inventoryRepo) > 0 {
		stockRepo = inventoryRepo[0]
	}

	return &productService{
		productRepo:   productRepo,
		inventoryRepo: stockRepo,
		uploadDir:     uploadDir,
	}
}

func (s *productService) Create(input CreateProductInput) (*models.Product, error) {
	imageURL, err := helpers.SaveUploadedProductImage(input.Image, s.uploadDir)
	if err != nil {
		logger.Error("failed to save product image", err, zap.String("module", "PRODUCT"))
		return nil, err
	}

	category, err := normalizeProductCategory(input.Category)
	if err != nil {
		return nil, err
	}

	product := &models.Product{
		Name:        strings.TrimSpace(input.Name),
		Description: strings.TrimSpace(input.Description),
		Price:       input.Price,
		Stock:       input.Stock,
		Category:    category,
		Weight:      input.Weight,
		ImageURL:    resolveProductImageURL(imageURL, input.ImageURL),
		Status:      normalizeProductStatus(input.Status, input.Stock),
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
		Search:      params.Search,
		Category:    params.Category,
		Status:      params.Status,
		AllowHidden: params.AllowHidden,
		Page:        params.Page,
		Limit:       params.Limit,
	})
	if err != nil {
		return nil, err
	}

	if !params.AllowHidden {
		for index := range products {
			if err := s.syncPublicStock(&products[index]); err != nil {
				return nil, err
			}
		}
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

	if err := s.syncPublicStock(product); err != nil {
		return nil, err
	}

	return product, nil
}

func (s *productService) GetByIDIncludingHidden(id uint) (*models.Product, error) {
	product, err := s.productRepo.FindByIDIncludingHidden(id)
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

	category, err := normalizeProductCategory(input.Category)
	if err != nil {
		return nil, err
	}
	category = alignCategoryWithFishType(category, product.FishBatch.FishType)

	oldImageURL := product.ImageURL
	if input.Image != nil {
		newImageURL, err := helpers.SaveUploadedProductImage(input.Image, s.uploadDir)
		if err != nil {
			logger.Error("failed to save updated product image", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", id))
			return nil, err
		}
		product.ImageURL = newImageURL
	} else if strings.TrimSpace(input.ImageURL) != "" {
		product.ImageURL = strings.TrimSpace(input.ImageURL)
	}

	product.Name = strings.TrimSpace(input.Name)
	product.Description = strings.TrimSpace(input.Description)
	product.Price = input.Price
	product.Stock = input.Stock
	product.Category = category
	product.Weight = input.Weight
	product.Status = normalizeProductStatus(input.Status, input.Stock)

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

func normalizeProductStatus(status string, stock int) string {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "hidden":
		return "hidden"
	case "out_of_stock":
		return "out_of_stock"
	case "available":
		if stock <= 0 {
			return "out_of_stock"
		}
		return "available"
	default:
		if stock <= 0 {
			return "out_of_stock"
		}
		return "available"
	}
}

func normalizeProductCategory(category string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(category)) {
	case "nila":
		return "Nila", nil
	case "lele":
		return "Lele", nil
	case "patin":
		return "Patin", nil
	case "gurame":
		return "Gurame", nil
	case "bawal":
		return "Bawal", nil
	case "bandeng":
		return "Bandeng", nil
	default:
		return "", ErrInvalidProductCategory
	}
}

func alignCategoryWithFishType(category, fishType string) string {
	switch strings.ToLower(strings.TrimSpace(fishType)) {
	case "nila":
		return "Nila"
	case "lele":
		return "Lele"
	case "patin":
		return "Patin"
	case "gurame":
		return "Gurame"
	case "bawal":
		return "Bawal"
	case "bandeng":
		return "Bandeng"
	default:
		return category
	}
}

func resolveProductImageURL(uploadedImageURL, inputImageURL string) string {
	if strings.TrimSpace(uploadedImageURL) != "" {
		return strings.TrimSpace(uploadedImageURL)
	}

	return strings.TrimSpace(inputImageURL)
}

func (s *productService) syncPublicStock(product *models.Product) error {
	if product == nil || s.inventoryRepo == nil {
		return nil
	}

	total, err := s.inventoryRepo.GetTotalAvailableByProduct(product.ID)
	if err != nil {
		logger.Error("failed to resolve public product stock from inventory", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", product.ID))
		return err
	}

	product.Stock = int(total)
	if product.Stock <= 0 {
		product.Stock = 0
		product.Status = "out_of_stock"
		return nil
	}

	product.Status = "available"
	return nil
}

func (s *productService) Delete(id uint, audit *AuditContext) error {
	product, err := s.productRepo.FindByIDIncludingHidden(id)
	if err != nil {
		logger.Error("failed to find product before delete", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", id))
		return err
	}
	if product == nil {
		return ErrProductNotFound
	}

	usage, err := s.productRepo.GetRelationUsage(id)
	if err != nil {
		logger.Error("failed to inspect product relations before delete", err, zap.String("module", "PRODUCT"), zap.Uint("product_id", id))
		return err
	}

	if usage.CartRefs > 0 || usage.OrderItemRefs > 0 || usage.InventoryRefs > 0 {
		return fmt.Errorf(
			"%w: cart=%d, order_items=%d, inventories=%d",
			ErrProductHasRelations,
			usage.CartRefs,
			usage.OrderItemRefs,
			usage.InventoryRefs,
		)
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
