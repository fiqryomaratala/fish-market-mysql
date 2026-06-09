package logger

import (
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/fiqryomaratala/backend/config"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	appLogger = zap.NewNop()
	once      sync.Once
)

func InitLogger() {
	once.Do(func() {
		cfg := config.GetConfig()
		logDir := "logs"
		if err := os.MkdirAll(logDir, os.ModePerm); err != nil {
			appLogger = zap.NewNop()
			return
		}

		logFilePath := filepath.Join(logDir, "app.log")
		file, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o666)
		if err != nil {
			appLogger = zap.NewNop()
			return
		}

		encoderConfig := zap.NewProductionEncoderConfig()
		encoderConfig.TimeKey = "time"
		encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
		encoderConfig.EncodeDuration = zapcore.StringDurationEncoder

		fileEncoder := zapcore.NewJSONEncoder(encoderConfig)
		consoleEncoder := zapcore.NewConsoleEncoder(encoderConfig)

		level := zap.NewAtomicLevelAt(parseLogLevel(cfg.LogLevel))
		core := zapcore.NewTee(
			zapcore.NewCore(fileEncoder, zapcore.AddSync(file), level),
			zapcore.NewCore(consoleEncoder, zapcore.AddSync(os.Stdout), level),
		)

		appLogger = zap.New(core, zap.AddCaller(), zap.AddStacktrace(zap.ErrorLevel))
	})
}

func GetLogger() *zap.Logger {
	return appLogger
}

func Sync() {
	_ = appLogger.Sync()
}

func Debug(message string, fields ...zap.Field) {
	GetLogger().Debug(message, fields...)
}

func Info(message string, fields ...zap.Field) {
	GetLogger().Info(message, fields...)
}

func Warn(message string, fields ...zap.Field) {
	GetLogger().Warn(message, fields...)
}

func Error(message string, err error, fields ...zap.Field) {
	if err != nil {
		fields = append(fields,
			zap.String("error_message", err.Error()),
			zap.Stack("stacktrace"),
		)
	}

	GetLogger().Error(message, fields...)
}

func parseLogLevel(level string) zapcore.Level {
	switch strings.ToLower(strings.TrimSpace(level)) {
	case "debug":
		return zap.DebugLevel
	case "warn":
		return zap.WarnLevel
	case "error":
		return zap.ErrorLevel
	default:
		return zap.InfoLevel
	}
}
