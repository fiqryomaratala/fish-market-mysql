package middleware

import (
	"errors"
	"strings"

	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
	appvalidator "github.com/fiqryomaratala/backend/internal/validator"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

func HandleError(c *gin.Context, err error) {
	if err == nil {
		return
	}

	switch {
	case errors.Is(err, gorm.ErrRecordNotFound),
		errors.Is(err, services.ErrProductNotFound),
		errors.Is(err, services.ErrPondNotFound),
		errors.Is(err, services.ErrFishBatchNotFound),
		errors.Is(err, services.ErrFeedingLogNotFound),
		errors.Is(err, services.ErrHarvestNotFound),
		errors.Is(err, services.ErrInventoryNotFound),
		errors.Is(err, services.ErrCartItemNotFound),
		errors.Is(err, services.ErrOrderNotFound),
		errors.Is(err, services.ErrNotificationNotFound),
		errors.Is(err, services.ErrActivityLogNotFound),
		errors.Is(err, services.ErrUserNotFound):
		utils.NotFound(c, err.Error())
	case errors.Is(err, services.ErrInvalidCredentials):
		utils.Error(c, 401, "Invalid email or password")
	case errors.Is(err, helpers.ErrInvalidToken):
		utils.Unauthorized(c)
	case errors.Is(err, services.ErrForbiddenOrderAccess),
		errors.Is(err, services.ErrForbiddenNotificationAccess):
		utils.Forbidden(c)
	case isValidationError(err):
		utils.ValidationError(c, appvalidator.FormatValidationErrors(err))
	default:
		utils.InternalServerError(c)
	}
}

func isValidationError(err error) bool {
	var validationErrs validator.ValidationErrors
	if errors.As(err, &validationErrs) {
		return true
	}

	switch {
	case errors.Is(err, services.ErrInvalidOrderStatus),
		errors.Is(err, services.ErrInvalidPaymentStatus),
		errors.Is(err, services.ErrOrderCannotBeCancelled),
		errors.Is(err, services.ErrInvalidReportType),
		errors.Is(err, services.ErrInvalidInventoryTransactionType),
		errors.Is(err, services.ErrInvalidInventoryTransactionQuantity),
		errors.Is(err, services.ErrInsufficientInventory),
		errors.Is(err, services.ErrCartEmpty),
		errors.Is(err, services.ErrPondInactive):
		return true
	}

	message := strings.ToLower(err.Error())
	return strings.Contains(message, "validation") ||
		strings.Contains(message, "required") ||
		strings.Contains(message, "invalid") ||
		strings.Contains(message, "must")
}
