package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
}

func respond(c *gin.Context, statusCode int, response APIResponse) {
	c.JSON(statusCode, response)
}

func Success(c *gin.Context, message string, data interface{}) {
	respond(c, http.StatusOK, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func Created(c *gin.Context, message string, data interface{}) {
	respond(c, http.StatusCreated, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func Error(c *gin.Context, status int, message string) {
	respond(c, status, APIResponse{
		Success: false,
		Message: message,
	})
}

func ValidationError(c *gin.Context, errors interface{}) {
	respond(c, http.StatusBadRequest, APIResponse{
		Success: false,
		Message: "Validation failed",
		Errors:  errors,
	})
}

func Unauthorized(c *gin.Context) {
	respond(c, http.StatusUnauthorized, APIResponse{
		Success: false,
		Message: "Unauthorized",
	})
}

func Forbidden(c *gin.Context) {
	respond(c, http.StatusForbidden, APIResponse{
		Success: false,
		Message: "Forbidden",
	})
}

func NotFound(c *gin.Context, message string) {
	respond(c, http.StatusNotFound, APIResponse{
		Success: false,
		Message: message,
	})
}

func InternalServerError(c *gin.Context) {
	respond(c, http.StatusInternalServerError, APIResponse{
		Success: false,
		Message: "Internal server error",
	})
}

func SuccessResponse(c *gin.Context, status int, message string, data interface{}) {
	respond(c, status, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, status int, message string) {
	respond(c, status, APIResponse{
		Success: false,
		Message: message,
	})
}

func ErrorResponseWithDetails(c *gin.Context, status int, message string, errors interface{}) {
	respond(c, status, APIResponse{
		Success: false,
		Message: message,
		Errors:  errors,
	})
}
