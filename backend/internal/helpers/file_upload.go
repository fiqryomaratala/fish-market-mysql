package helpers

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

const MaxProfilePhotoSize = 2 * 1024 * 1024

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

func ValidateProfilePhoto(file *multipart.FileHeader) error {
	if file == nil {
		return fmt.Errorf("file photo wajib diunggah")
	}

	if file.Size > MaxProfilePhotoSize {
		return fmt.Errorf("ukuran file maksimal 2MB")
	}

	extension := strings.ToLower(filepath.Ext(file.Filename))
	allowedExtensions := map[string]struct{}{
		".jpg":  {},
		".jpeg": {},
		".png":  {},
		".webp": {},
	}

	if _, ok := allowedExtensions[extension]; !ok {
		return fmt.Errorf("format file harus jpg, jpeg, png, atau webp")
	}

	return nil
}

func GenerateProfilePhotoFilename(userID uint, originalFilename string) string {
	extension := strings.ToLower(filepath.Ext(originalFilename))
	timestamp := time.Now().Unix()
	return fmt.Sprintf("customer_%d_%d%s", userID, timestamp, extension)
}

func SaveUploadedProfilePhoto(file *multipart.FileHeader, uploadDir string, userID uint) (string, error) {
	if err := ValidateProfilePhoto(file); err != nil {
		return "", err
	}

	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return "", err
	}

	filename := GenerateProfilePhotoFilename(userID, file.Filename)
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

	return filepath.ToSlash(filepath.Join("/uploads/profile", filename)), nil
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
