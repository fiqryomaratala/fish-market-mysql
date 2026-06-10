package tests

import (
	"sync"
	"testing"

	"github.com/fiqryomaratala/backend/config"
	"github.com/fiqryomaratala/backend/internal/logger"
)

var setupOnce sync.Once

func SetupTest(t *testing.T) {
	t.Helper()

	setupOnce.Do(func() {
		config.LoadConfig()
		logger.InitLogger()
	})
}
