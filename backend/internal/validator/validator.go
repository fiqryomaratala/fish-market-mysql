package validator

import (
	"errors"
	"regexp"
	"strings"
	"sync"

	playgroundvalidator "github.com/go-playground/validator/v10"
)

type Validator struct {
	validate *playgroundvalidator.Validate
}

var (
	instance *Validator
	once     sync.Once
)

func getValidator() *Validator {
	once.Do(func() {
		instance = &Validator{
			validate: playgroundvalidator.New(),
		}
	})

	return instance
}

func ValidateStruct(data interface{}) error {
	return getValidator().validate.Struct(data)
}

func FormatValidationErrors(err error) map[string]string {
	if err == nil {
		return nil
	}

	var validationErrs playgroundvalidator.ValidationErrors
	if !errors.As(err, &validationErrs) {
		return map[string]string{
			"error": err.Error(),
		}
	}

	formatted := make(map[string]string, len(validationErrs))
	for _, fieldErr := range validationErrs {
		field := resolveFieldName(fieldErr)
		formatted[field] = buildMessage(field, fieldErr)
	}

	return formatted
}

func FieldError(field, message string) map[string]string {
	return map[string]string{
		field: message,
	}
}

func buildMessage(field string, fieldErr playgroundvalidator.FieldError) string {
	switch fieldErr.Tag() {
	case "required":
		return field + " is required"
	case "email":
		return field + " must be a valid email"
	case "min":
		return field + " must be at least " + fieldErr.Param() + " characters"
	case "max":
		return field + " must be at most " + fieldErr.Param() + " characters"
	case "gt":
		return field + " must be greater than " + fieldErr.Param()
	case "gte":
		return field + " must be greater than or equal to " + fieldErr.Param()
	case "oneof":
		return field + " must be one of: " + strings.ReplaceAll(fieldErr.Param(), " ", ", ")
	default:
		return field + " is invalid"
	}
}

func resolveFieldName(fieldErr playgroundvalidator.FieldError) string {
	return toSnakeCase(fieldErr.StructField())
}

var snakeCasePattern = regexp.MustCompile("([a-z0-9])([A-Z])")

func toSnakeCase(value string) string {
	snake := snakeCasePattern.ReplaceAllString(value, "${1}_${2}")
	return strings.ToLower(snake)
}
