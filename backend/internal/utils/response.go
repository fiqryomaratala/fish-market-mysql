package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse = gin.H

func Success(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": message,
		"data":    data,
	})
}

func Created(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": message,
		"data":    data,
	})
}

func Error(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{
		"success": false,
		"message": message,
	})
}

func ValidationError(c *gin.Context, err interface{}) {
	c.JSON(http.StatusBadRequest, gin.H{
		"success": false,
		"message": "Validation failed",
		"errors":  err,
	})
}

func Unauthorized(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, gin.H{
		"success": false,
		"message": "Unauthorized",
	})
}

func Forbidden(c *gin.Context) {
	c.JSON(http.StatusForbidden, gin.H{
		"success": false,
		"message": "Forbidden",
	})
}

func NotFound(c *gin.Context, message string) {
	c.JSON(http.StatusNotFound, gin.H{
		"success": false,
		"message": message,
	})
}

func SuccessResponse(c *gin.Context, status int, message string, data interface{}) {
	c.JSON(status, gin.H{
		"success": true,
		"message": message,
		"data":    data,
	})
}

func ErrorResponse(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{
		"success": false,
		"message": message,
	})
}

func ErrorResponseWithDetails(c *gin.Context, status int, message string, errors interface{}) {
	c.JSON(status, gin.H{
		"success": false,
		"message": message,
		"errors":  errors,
	})
}
