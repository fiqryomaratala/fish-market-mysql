package helpers

import (
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

func SaveUploadedProductImage(file *multipart.FileHeader, uploadDir string) (string, error) {
	if file == nil {
		return "", nil
	}

	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return "", err
	}

	extension := filepath.Ext(file.Filename)
	filename := uuid.NewString() + extension
	destination := filepath.Join(uploadDir, filename)

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	dst, err := os.Create(destination)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := dst.ReadFrom(src); err != nil {
		return "", err
	}

	return filepath.ToSlash(filepath.Join("/uploads/products", filename)), nil
}

func DeleteUploadedFile(filePath string) error {
	if filePath == "" {
		return nil
	}

	relativePath := strings.TrimPrefix(filepath.ToSlash(filePath), "/")
	cleanPath := filepath.Clean(relativePath)
	if _, err := os.Stat(cleanPath); os.IsNotExist(err) {
		return nil
	}

	return os.Remove(cleanPath)
}
