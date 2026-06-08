package services

import (
	"errors"
	"mime/multipart"
	"strings"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
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
}

type UpdateProductInput struct {
	Name        string
	Description string
	Price       float64
	Stock       int
	Category    string
	Image       *multipart.FileHeader
}

type ProductService interface {
	Create(input CreateProductInput) (*models.Product, error)
	GetAll(params ProductListParams) (*ProductListResult, error)
	GetByID(id uint) (*models.Product, error)
	Update(id uint, input UpdateProductInput) (*models.Product, error)
	Delete(id uint) error
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
		return nil, err
	}

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
		return nil, err
	}

	if input.Image != nil && oldImageURL != "" && oldImageURL != product.ImageURL {
		_ = helpers.DeleteUploadedFile(oldImageURL)
	}

	return product, nil
}

func (s *productService) Delete(id uint) error {
	product, err := s.productRepo.FindByID(id)
	if err != nil {
		return err
	}
	if product == nil {
		return ErrProductNotFound
	}

	if err := s.productRepo.Delete(product); err != nil {
		return err
	}

	if product.ImageURL != "" {
		_ = helpers.DeleteUploadedFile(product.ImageURL)
	}

	return nil
}
