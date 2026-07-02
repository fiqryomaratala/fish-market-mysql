package config

import (
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
)

type Config struct {
	AppName            string
	AppEnv             string
	AppPort            string
	BaseURL            string
	FrontendURL        string
	CORSAllowedOrigins string
	LogLevel           string
	DBHost             string
	DBPort             string
	DBUser             string
	DBPassword         string
	DBName             string
	DBCharset          string
	JWTSecret          string
	JWTExpired         string
	UploadPath         string
	XenditAPIKey       string
	XenditWebhookToken string
}

var (
	appConfig *Config
	once      sync.Once
)

func LoadConfig() {
	once.Do(func() {
		_ = godotenv.Load()

		appConfig = &Config{
			AppName:            getEnv("APP_NAME", "Fish Marketplace Backend"),
			AppEnv:             getEnv("APP_ENV", "development"),
			AppPort:            getEnv("APP_PORT", "8080"),
			BaseURL:            getEnv("BASE_URL", "http://localhost"),
			FrontendURL:        getEnv("FRONTEND_URL", "http://localhost:5173"),
			CORSAllowedOrigins: getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173"),
			LogLevel:           getEnv("LOG_LEVEL", "debug"),
			DBHost:             getEnv("DB_HOST", "localhost"),
			DBPort:             getEnv("DB_PORT", "3306"),
			DBUser:             getEnv("DB_USER", "root"),
			DBPassword:         getEnv("DB_PASSWORD", "password"),
			DBName:             getEnv("DB_NAME", "fish_market_db"),
			DBCharset:          getEnv("DB_CHARSET", "utf8mb4"),
			JWTSecret:          getEnv("JWT_SECRET", "your-secret-key"),
			JWTExpired:         getEnv("JWT_EXPIRED", "24h"),
			UploadPath:         getEnv("UPLOAD_PATH", "uploads/"),
			XenditAPIKey:       getEnv("XENDIT_API_KEY", ""),
			XenditWebhookToken: getEnv("XENDIT_WEBHOOK_TOKEN", ""),
		}

		validateConfig(appConfig)
	})
}

func GetConfig() *Config {
	if appConfig == nil {
		LoadConfig()
	}

	return appConfig
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

func validateConfig(cfg *Config) {
	if cfg.DBHost == "" {
		log.Fatal("DB_HOST is required")
	}

	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET is required")
	}
}
