package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
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

// Create godoc
// @Summary Create product
// @Description Create a new product with optional image upload
// @Tags Product
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param name formData string true "Product name"
// @Param description formData string false "Product description"
// @Param price formData number true "Product price"
// @Param stock formData int false "Product stock"
// @Param category formData string false "Product category"
// @Param image formData file false "Product image"
// @Success 201 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /admin/products [post]
func (h *ProductHandler) Create(c *gin.Context) {
	input, err := parseProductForm(c)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	image, err := c.FormFile("image")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		utils.Error(c, http.StatusBadRequest, "Invalid image upload")
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
		middleware.HandleError(c, err)
		return
	}

	utils.Created(c, "Product created successfully", toProductResponse(product))
}

// GetAll godoc
// @Summary Get all products
// @Description Get public product list with search, category, and pagination
// @Tags Product
// @Produce json
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Param search query string false "Search keyword"
// @Param category query string false "Filter by category"
// @Success 200 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /products [get]
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
		middleware.HandleError(c, err)
		return
	}

	products := make([]ProductResponse, 0, len(result.Products))
	for _, product := range result.Products {
		products = append(products, toProductResponse(&product))
	}

	utils.Success(c, "Products fetched successfully", gin.H{
		"items": products,
		"meta": gin.H{
			"page":  result.Page,
			"limit": result.Limit,
			"total": result.Total,
		},
	})
}

// GetByID godoc
// @Summary Get product detail
// @Description Get product detail by ID
// @Tags Product
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /products/{id} [get]
func (h *ProductHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid product ID")
		return
	}

	product, err := h.productService.GetByID(uint(id))
	if err != nil {
		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Product fetched successfully", toProductResponse(product))
}

// Update godoc
// @Summary Update product
// @Description Update product data and optionally replace image
// @Tags Product
// @Accept multipart/form-data
// @Produce json
// @Security BearerAuth
// @Param id path int true "Product ID"
// @Param name formData string true "Product name"
// @Param description formData string false "Product description"
// @Param price formData number true "Product price"
// @Param stock formData int false "Product stock"
// @Param category formData string false "Product category"
// @Param image formData file false "Product image"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /admin/products/{id} [put]
func (h *ProductHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid product ID")
		return
	}

	input, err := parseProductForm(c)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	image, err := c.FormFile("image")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		utils.Error(c, http.StatusBadRequest, "Invalid image upload")
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
		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Product updated successfully", toProductResponse(product))
}

// Delete godoc
// @Summary Delete product
// @Description Delete product by ID
// @Tags Product
// @Produce json
// @Security BearerAuth
// @Param id path int true "Product ID"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 404 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /admin/products/{id} [delete]
func (h *ProductHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		utils.Error(c, http.StatusBadRequest, "Invalid product ID")
		return
	}

	if err := h.productService.Delete(uint(id), auditContextFromGin(c)); err != nil {
		middleware.HandleError(c, err)
		return
	}

	utils.Success(c, "Product deleted successfully", nil)
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
