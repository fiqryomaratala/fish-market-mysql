package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	productService services.ProductService
}

type ProductResponse struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Category    string  `json:"category"`
	ImageURL    string  `json:"image_url"`
	Status      string  `json:"status"`
}

func NewProductHandler(productService services.ProductService) *ProductHandler {
	return &ProductHandler{productService: productService}
}

func (h *ProductHandler) Create(c *gin.Context) {
	input, err := parseProductForm(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	image, err := c.FormFile("image")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		ErrorResponse(c, http.StatusBadRequest, "Invalid image upload")
		return
	}

	product, err := h.productService.Create(services.CreateProductInput{
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Stock:       input.Stock,
		Category:    input.Category,
		Image:       image,
		Audit:       auditContextFromGin(c),
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to create product")
		return
	}

	SuccessResponse(c, http.StatusCreated, "Product created successfully", toProductResponse(product))
}

func (h *ProductHandler) GetAll(c *gin.Context) {
	page := parsePositiveInt(c.DefaultQuery("page", "1"), 1)
	limit := parsePositiveInt(c.DefaultQuery("limit", "10"), 10)

	result, err := h.productService.GetAll(services.ProductListParams{
		Search:   c.Query("search"),
		Category: c.Query("category"),
		Page:     page,
		Limit:    limit,
	})
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch products")
		return
	}

	products := make([]ProductResponse, 0, len(result.Products))
	for _, product := range result.Products {
		products = append(products, toProductResponse(&product))
	}

	SuccessResponse(c, http.StatusOK, "Products fetched successfully", gin.H{
		"items": products,
		"meta": gin.H{
			"page":  result.Page,
			"limit": result.Limit,
			"total": result.Total,
		},
	})
}

func (h *ProductHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid product ID")
		return
	}

	product, err := h.productService.GetByID(uint(id))
	if err != nil {
		if errors.Is(err, services.ErrProductNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Product not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch product")
		return
	}

	SuccessResponse(c, http.StatusOK, "Product fetched successfully", toProductResponse(product))
}

func (h *ProductHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid product ID")
		return
	}

	input, err := parseProductForm(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	image, err := c.FormFile("image")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		ErrorResponse(c, http.StatusBadRequest, "Invalid image upload")
		return
	}

	product, err := h.productService.Update(uint(id), services.UpdateProductInput{
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Stock:       input.Stock,
		Category:    input.Category,
		Image:       image,
		Audit:       auditContextFromGin(c),
	})
	if err != nil {
		if errors.Is(err, services.ErrProductNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Product not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to update product")
		return
	}

	SuccessResponse(c, http.StatusOK, "Product updated successfully", toProductResponse(product))
}

func (h *ProductHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		ErrorResponse(c, http.StatusBadRequest, "Invalid product ID")
		return
	}

	if err := h.productService.Delete(uint(id), auditContextFromGin(c)); err != nil {
		if errors.Is(err, services.ErrProductNotFound) {
			ErrorResponse(c, http.StatusNotFound, "Product not found")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to delete product")
		return
	}

	SuccessResponse(c, http.StatusOK, "Product deleted successfully", nil)
}

type productFormInput struct {
	Name        string
	Description string
	Price       float64
	Stock       int
	Category    string
}

func parseProductForm(c *gin.Context) (*productFormInput, error) {
	name := strings.TrimSpace(c.PostForm("name"))
	if name == "" {
		return nil, errors.New("Name is required")
	}

	price, err := strconv.ParseFloat(strings.TrimSpace(c.PostForm("price")), 64)
	if err != nil {
		return nil, errors.New("Price must be a valid number")
	}
	if price <= 0 {
		return nil, errors.New("Price must be greater than 0")
	}

	stock, err := strconv.Atoi(strings.TrimSpace(c.DefaultPostForm("stock", "0")))
	if err != nil {
		return nil, errors.New("Stock must be a valid integer")
	}
	if stock < 0 {
		return nil, errors.New("Stock must be greater than or equal to 0")
	}

	return &productFormInput{
		Name:        name,
		Description: strings.TrimSpace(c.PostForm("description")),
		Price:       price,
		Stock:       stock,
		Category:    strings.TrimSpace(c.PostForm("category")),
	}, nil
}

func parsePositiveInt(value string, defaultValue int) int {
	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return defaultValue
	}

	return parsed
}

func toProductResponse(product *models.Product) ProductResponse {
	return ProductResponse{
		ID:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		Price:       product.Price,
		Stock:       product.Stock,
		Category:    product.Category,
		ImageURL:    product.ImageURL,
		Status:      product.Status,
	}
}
