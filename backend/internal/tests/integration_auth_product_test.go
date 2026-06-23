package tests

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"testing"
	"time"

	"github.com/fiqryomaratala/backend/internal/handlers"
	"github.com/fiqryomaratala/backend/internal/middleware"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type integrationUserRepository struct {
	mu      sync.Mutex
	nextID  uint
	byID    map[uint]*models.User
	byEmail map[string]*models.User
}

func newIntegrationUserRepository(seedUsers ...*models.User) repositories.UserRepository {
	repo := &integrationUserRepository{
		nextID:  1,
		byID:    make(map[uint]*models.User),
		byEmail: make(map[string]*models.User),
	}

	for _, user := range seedUsers {
		cloned := cloneUser(user)
		if cloned.ID == 0 {
			cloned.ID = repo.nextID
			repo.nextID++
		}
		if cloned.ID >= repo.nextID {
			repo.nextID = cloned.ID + 1
		}
		repo.byID[cloned.ID] = cloned
		repo.byEmail[cloned.Email] = cloned
	}

	return repo
}

func (r *integrationUserRepository) Create(user *models.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	user.ID = r.nextID
	r.nextID++
	user.CreatedAt = time.Now()
	user.UpdatedAt = user.CreatedAt

	cloned := cloneUser(user)
	r.byID[user.ID] = cloned
	r.byEmail[user.Email] = cloned
	return nil
}

func (r *integrationUserRepository) FindAll(filter repositories.UserFilter) ([]models.User, int64, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	users := make([]models.User, 0, len(r.byID))
	for _, user := range r.byID {
		users = append(users, *cloneUser(user))
	}

	return users, int64(len(users)), nil
}

func (r *integrationUserRepository) FindByEmail(email string) (*models.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, ok := r.byEmail[email]
	if !ok {
		return nil, nil
	}

	return cloneUser(user), nil
}

func (r *integrationUserRepository) FindByID(id uint) (*models.User, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, ok := r.byID[id]
	if !ok {
		return nil, nil
	}

	return cloneUser(user), nil
}

func (r *integrationUserRepository) Update(user *models.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.byID[user.ID]; !ok {
		return gorm.ErrRecordNotFound
	}

	user.UpdatedAt = time.Now()
	cloned := cloneUser(user)
	r.byID[user.ID] = cloned
	r.byEmail[user.Email] = cloned
	return nil
}

func (r *integrationUserRepository) Delete(user *models.User) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	existing, ok := r.byID[user.ID]
	if !ok {
		return gorm.ErrRecordNotFound
	}

	delete(r.byID, user.ID)
	delete(r.byEmail, existing.Email)
	return nil
}

func (r *integrationUserRepository) UpdateRole(id uint, role string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, ok := r.byID[id]
	if !ok {
		return gorm.ErrRecordNotFound
	}

	user.Role = role
	user.UpdatedAt = time.Now()
	r.byID[id] = cloneUser(user)
	r.byEmail[user.Email] = cloneUser(user)
	return nil
}

func (r *integrationUserRepository) UpdateStatus(id uint, status string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	user, ok := r.byID[id]
	if !ok {
		return gorm.ErrRecordNotFound
	}

	user.Status = status
	user.UpdatedAt = time.Now()
	r.byID[id] = cloneUser(user)
	r.byEmail[user.Email] = cloneUser(user)
	return nil
}

type integrationProductRepository struct {
	mu       sync.Mutex
	nextID   uint
	products map[uint]*models.Product
}

func newIntegrationProductRepository() repositories.ProductRepository {
	return &integrationProductRepository{
		nextID:   1,
		products: make(map[uint]*models.Product),
	}
}

func (r *integrationProductRepository) Create(product *models.Product) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	product.ID = r.nextID
	r.nextID++
	product.CreatedAt = time.Now()
	product.UpdatedAt = product.CreatedAt

	r.products[product.ID] = cloneProduct(product)
	return nil
}

func (r *integrationProductRepository) FindAll(filter repositories.ProductFilter) ([]models.Product, int64, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	items := make([]models.Product, 0, len(r.products))
	for _, product := range r.products {
		items = append(items, *cloneProduct(product))
	}

	return items, int64(len(items)), nil
}

func (r *integrationProductRepository) FindByID(id uint) (*models.Product, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	product, ok := r.products[id]
	if !ok {
		return nil, nil
	}

	return cloneProduct(product), nil
}

func (r *integrationProductRepository) FindByIDIncludingHidden(id uint) (*models.Product, error) {
	return r.FindByID(id)
}

func (r *integrationProductRepository) GetRelationUsage(id uint) (*repositories.ProductRelationUsage, error) {
	return &repositories.ProductRelationUsage{}, nil
}

func (r *integrationProductRepository) FindByFishType(fishType string) (*models.Product, error) {
	return nil, nil
}

func (r *integrationProductRepository) Update(product *models.Product) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.products[product.ID]; !ok {
		return gorm.ErrRecordNotFound
	}

	product.UpdatedAt = time.Now()
	r.products[product.ID] = cloneProduct(product)
	return nil
}

func (r *integrationProductRepository) Delete(product *models.Product) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.products, product.ID)
	return nil
}

func TestIntegrationAuthProductFlow(t *testing.T) {
	SetupTest(t)
	gin.SetMode(gin.TestMode)

	adminPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	require.NoError(t, err)

	uploadBaseDir := t.TempDir()
	router := setupIntegrationRouter(t, uploadBaseDir, &models.User{
		Model:    gorm.Model{ID: 1},
		Name:     "Admin Fish Market",
		Email:    "admin@fishmarket.com",
		Password: string(adminPassword),
		Role:     "admin",
	})

	customerEmail := "integration.customer@example.com"
	customerPassword := "password123"

	registerBody := map[string]string{
		"name":     "Integration Customer",
		"email":    customerEmail,
		"password": customerPassword,
	}
	registerRecorder := performJSONRequest(t, router, http.MethodPost, "/api/auth/register", registerBody, "")
	require.Equal(t, http.StatusCreated, registerRecorder.Code)
	assert.Contains(t, registerRecorder.Body.String(), `"message":"Register berhasil"`)

	wrongLoginBody := map[string]string{
		"email":    customerEmail,
		"password": "salah123",
	}
	wrongLoginRecorder := performJSONRequest(t, router, http.MethodPost, "/api/auth/login", wrongLoginBody, "")
	require.Equal(t, http.StatusUnauthorized, wrongLoginRecorder.Code)
	assert.Contains(t, wrongLoginRecorder.Body.String(), `"message":"Invalid email or password"`)

	customerToken := loginAndExtractToken(t, router, customerEmail, customerPassword)
	adminToken := loginAndExtractToken(t, router, "admin@fishmarket.com", "password123")

	profileRecorder := performJSONRequest(t, router, http.MethodGet, "/api/auth/profile", nil, customerToken)
	require.Equal(t, http.StatusOK, profileRecorder.Code)
	assert.Contains(t, profileRecorder.Body.String(), customerEmail)

	profileAliasRecorder := performJSONRequest(t, router, http.MethodGet, "/api/profile", nil, customerToken)
	require.Equal(t, http.StatusOK, profileAliasRecorder.Code)
	assert.Contains(t, profileAliasRecorder.Body.String(), customerEmail)

	updateProfileRecorder := performJSONRequest(t, router, http.MethodPut, "/api/profile", map[string]string{
		"name":    "Customer Update",
		"phone":   "08123456789",
		"address": "Jl. Ikan Segar No. 1",
	}, customerToken)
	require.Equal(t, http.StatusOK, updateProfileRecorder.Code)
	assert.Contains(t, updateProfileRecorder.Body.String(), `"name":"Customer Update"`)
	assert.Contains(t, updateProfileRecorder.Body.String(), `"phone":"08123456789"`)
	assert.Contains(t, updateProfileRecorder.Body.String(), `"address":"Jl. Ikan Segar No. 1"`)

	changePasswordRecorder := performJSONRequest(t, router, http.MethodPut, "/api/profile/password", map[string]string{
		"current_password": customerPassword,
		"new_password":     "passwordBaru123",
		"confirm_password": "passwordBaru123",
	}, customerToken)
	require.Equal(t, http.StatusOK, changePasswordRecorder.Code)
	assert.Contains(t, changePasswordRecorder.Body.String(), `"message":"Password berhasil diperbarui"`)

	oldPasswordLoginRecorder := performJSONRequest(t, router, http.MethodPost, "/api/auth/login", map[string]string{
		"email":    customerEmail,
		"password": customerPassword,
	}, "")
	require.Equal(t, http.StatusUnauthorized, oldPasswordLoginRecorder.Code)
	assert.Contains(t, oldPasswordLoginRecorder.Body.String(), `"message":"Invalid email or password"`)

	customerToken = loginAndExtractToken(t, router, customerEmail, "passwordBaru123")

	customerAdminRecorder := performJSONRequest(t, router, http.MethodGet, "/api/admin/dashboard", nil, customerToken)
	require.Equal(t, http.StatusForbidden, customerAdminRecorder.Code)
	assert.Contains(t, customerAdminRecorder.Body.String(), `"message":"Forbidden"`)

	adminDashboardRecorder := performJSONRequest(t, router, http.MethodGet, "/api/admin/dashboard", nil, adminToken)
	require.Equal(t, http.StatusOK, adminDashboardRecorder.Code)
	assert.Contains(t, adminDashboardRecorder.Body.String(), `"message":"Admin dashboard access granted"`)

	customerProfileRecorder := performJSONRequest(t, router, http.MethodGet, "/api/customer/profile", nil, customerToken)
	require.Equal(t, http.StatusOK, customerProfileRecorder.Code)
	assert.Contains(t, customerProfileRecorder.Body.String(), customerEmail)

	uploadPhotoRecorder := performMultipartRequest(t, router, http.MethodPost, "/api/profile/photo", nil, "photo", "avatar.png", []byte("fake-profile-image"), customerToken)
	require.Equal(t, http.StatusOK, uploadPhotoRecorder.Code)
	assert.Contains(t, uploadPhotoRecorder.Body.String(), `"status":"success"`)
	assert.Contains(t, uploadPhotoRecorder.Body.String(), `"/uploads/profile/customer_`)

	createProductRecorder := performMultipartRequest(t, router, http.MethodPost, "/api/admin/products", map[string]string{
		"name":        "Ikan Nila Integrasi",
		"description": "Produk hasil integration test",
		"price":       "35000",
		"stock":       "12",
		"category":    "Nila",
	}, "image", "nila-test.jpg", []byte("fake-image-content"), adminToken)
	require.Equal(t, http.StatusCreated, createProductRecorder.Code)

	var createProductResponse apiResponseEnvelope
	require.NoError(t, json.Unmarshal(createProductRecorder.Body.Bytes(), &createProductResponse))
	require.True(t, createProductResponse.Success)

	dataMap, ok := createProductResponse.Data.(map[string]interface{})
	require.True(t, ok)
	require.Equal(t, "Ikan Nila Integrasi", dataMap["name"])
	imageURL, ok := dataMap["image_url"].(string)
	require.True(t, ok)
	assert.NotEmpty(t, imageURL)

	productID := int(dataMap["id"].(float64))

	getProductsRecorder := performJSONRequest(t, router, http.MethodGet, "/api/products", nil, "")
	require.Equal(t, http.StatusOK, getProductsRecorder.Code)
	assert.Contains(t, getProductsRecorder.Body.String(), "Ikan Nila Integrasi")

	getProductRecorder := performJSONRequest(t, router, http.MethodGet, "/api/products/"+strconv.Itoa(productID), nil, "")
	require.Equal(t, http.StatusOK, getProductRecorder.Code)
	assert.Contains(t, getProductRecorder.Body.String(), "Ikan Nila Integrasi")

	imageRecorder := performJSONRequest(t, router, http.MethodGet, imageURL, nil, "")
	require.Equal(t, http.StatusOK, imageRecorder.Code)

	savedImagePath := filepath.Join(uploadBaseDir, filepath.FromSlash(imageURL[len("/uploads/"):]))
	_, statErr := os.Stat(savedImagePath)
	assert.NoError(t, statErr)
}

func setupIntegrationRouter(t *testing.T, uploadBaseDir string, seedUsers ...*models.User) *gin.Engine {
	t.Helper()

	userRepo := newIntegrationUserRepository(seedUsers...)
	productRepo := newIntegrationProductRepository()

	authService := services.NewAuthService(userRepo)
	productService := services.NewProductService(productRepo, filepath.Join(uploadBaseDir, "products"))

	authHandler := handlers.NewAuthHandler(authService)
	productHandler := handlers.NewProductHandler(productService)
	accessHandler := handlers.NewAccessHandler()

	router := gin.New()
	router.Use(middleware.RecoveryMiddleware())
	router.Static("/uploads", uploadBaseDir)

	auth := router.Group("/api/auth")
	auth.POST("/register", authHandler.Register)
	auth.POST("/login", authHandler.Login)
	auth.GET("/profile", middleware.AuthMiddleware(), authHandler.Profile)

	profileAPI := router.Group("/api")
	profileAPI.GET("/profile", middleware.AuthMiddleware(), authHandler.Profile)
	profileAPI.PUT("/profile", middleware.AuthMiddleware(), authHandler.UpdateProfile)
	profileAPI.PUT("/profile/password", middleware.AuthMiddleware(), authHandler.ChangePassword)
	profileAPI.POST("/profile/photo", middleware.AuthMiddleware(), authHandler.UploadProfilePhoto)

	customer := router.Group("/api/customer")
	customer.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin", "staff", "customer"))
	customer.GET("/profile", authHandler.Profile)

	admin := router.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin"))
	admin.GET("/dashboard", accessHandler.AdminDashboard)
	admin.POST("/products", productHandler.Create)

	api := router.Group("/api")
	api.GET("/products", productHandler.GetAll)
	api.GET("/products/:id", productHandler.GetByID)

	return router
}

func performJSONRequest(t *testing.T, router *gin.Engine, method, path string, body interface{}, token string) *httptest.ResponseRecorder {
	t.Helper()

	var payload []byte
	var err error
	if body != nil {
		payload, err = json.Marshal(body)
		require.NoError(t, err)
	}

	request := httptest.NewRequest(method, path, bytes.NewReader(payload))
	if body != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	if token != "" {
		request.Header.Set("Authorization", "Bearer "+token)
	}

	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)
	return recorder
}

func performMultipartRequest(
	t *testing.T,
	router *gin.Engine,
	method, path string,
	fields map[string]string,
	fileField, fileName string,
	fileContent []byte,
	token string,
) *httptest.ResponseRecorder {
	t.Helper()

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	for key, value := range fields {
		require.NoError(t, writer.WriteField(key, value))
	}

	if fileField != "" {
		fileWriter, err := writer.CreateFormFile(fileField, fileName)
		require.NoError(t, err)
		_, err = fileWriter.Write(fileContent)
		require.NoError(t, err)
	}

	require.NoError(t, writer.Close())

	request := httptest.NewRequest(method, path, &body)
	request.Header.Set("Content-Type", writer.FormDataContentType())
	if token != "" {
		request.Header.Set("Authorization", "Bearer "+token)
	}

	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, request)
	return recorder
}

func loginAndExtractToken(t *testing.T, router *gin.Engine, email, password string) string {
	t.Helper()

	recorder := performJSONRequest(t, router, http.MethodPost, "/api/auth/login", map[string]string{
		"email":    email,
		"password": password,
	}, "")

	require.Equal(t, http.StatusOK, recorder.Code)

	var response apiResponseEnvelope
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &response))
	require.True(t, response.Success)

	dataMap, ok := response.Data.(map[string]interface{})
	require.True(t, ok)

	token, ok := dataMap["token"].(string)
	require.True(t, ok)
	require.NotEmpty(t, token)

	return token
}

type apiResponseEnvelope struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Errors  interface{} `json:"errors"`
}

func cloneUser(user *models.User) *models.User {
	if user == nil {
		return nil
	}

	cloned := *user
	return &cloned
}

func cloneProduct(product *models.Product) *models.Product {
	if product == nil {
		return nil
	}

	cloned := *product
	return &cloned
}
