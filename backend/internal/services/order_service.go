package services

import (
	"bytes"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/fiqryomaratala/backend/internal/helpers"
	"github.com/fiqryomaratala/backend/internal/models"
	"github.com/fiqryomaratala/backend/internal/repositories"
	"github.com/jung-kurt/gofpdf"
)

var ErrOrderNotFound = errors.New("order not found")
var ErrForbiddenOrderAccess = errors.New("forbidden order access")
var ErrInvalidOrderStatus = errors.New("invalid order status")
var ErrInvalidPaymentStatus = errors.New("invalid payment status")

type OrderListParams struct {
	Page   int
	Limit  int
	UserID uint
	Role   string
}

type UpdateOrderStatusInput struct {
	Status string
	Audit  *AuditContext
}

type UpdateOrderPaymentInput struct {
	PaymentStatus string
	Audit         *AuditContext
}

type OrderService interface {
	GetAll(params OrderListParams) ([]dto.OrderResponse, map[string]interface{}, error)
	GetByID(id, requesterID uint, role string) (*dto.OrderResponse, error)
	UpdateStatus(id uint, input UpdateOrderStatusInput) (*dto.OrderResponse, error)
	UpdatePayment(id uint, input UpdateOrderPaymentInput) (*dto.OrderResponse, error)
	GenerateInvoicePDF(id, requesterID uint, role string) ([]byte, string, error)
}

type orderService struct {
	orderRepo repositories.OrderRepository
}

func NewOrderService(orderRepo repositories.OrderRepository) OrderService {
	return &orderService{orderRepo: orderRepo}
}

func (s *orderService) GetAll(params OrderListParams) ([]dto.OrderResponse, map[string]interface{}, error) {
	filter := repositories.OrderFilter{
		Page:  params.Page,
		Limit: params.Limit,
	}
	if !strings.EqualFold(strings.TrimSpace(params.Role), "admin") {
		filter.UserID = params.UserID
	}

	orders, total, err := s.orderRepo.FindAll(filter)
	if err != nil {
		return nil, nil, err
	}

	items := make([]dto.OrderResponse, 0, len(orders))
	for _, order := range orders {
		items = append(items, toOrderDTO(&order))
	}

	return items, map[string]interface{}{
		"page":  params.Page,
		"limit": params.Limit,
		"total": total,
	}, nil
}

func (s *orderService) GetByID(id, requesterID uint, role string) (*dto.OrderResponse, error) {
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if order == nil {
		return nil, ErrOrderNotFound
	}
	if !strings.EqualFold(strings.TrimSpace(role), "admin") && order.UserID != requesterID {
		return nil, ErrForbiddenOrderAccess
	}

	result := toOrderDTO(order)
	return &result, nil
}

func (s *orderService) UpdateStatus(id uint, input UpdateOrderStatusInput) (*dto.OrderResponse, error) {
	status := strings.TrimSpace(strings.ToLower(input.Status))
	switch status {
	case "pending", "processing", "shipping", "completed", "cancelled":
	default:
		return nil, ErrInvalidOrderStatus
	}

	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if order == nil {
		return nil, ErrOrderNotFound
	}

	order.Status = status
	if err := s.orderRepo.Update(order); err != nil {
		return nil, err
	}

	if input.Audit != nil && status == "completed" {
		helpers.LogActivity(input.Audit.UserID, "UPDATE", "ORDER", "Order "+order.InvoiceNumber+" completed", input.Audit.IPAddress, input.Audit.UserAgent)
	}

	updated, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	result := toOrderDTO(updated)
	return &result, nil
}

func (s *orderService) UpdatePayment(id uint, input UpdateOrderPaymentInput) (*dto.OrderResponse, error) {
	paymentStatus := strings.TrimSpace(strings.ToLower(input.PaymentStatus))
	switch paymentStatus {
	case "unpaid", "paid":
	default:
		return nil, ErrInvalidPaymentStatus
	}

	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if order == nil {
		return nil, ErrOrderNotFound
	}

	order.PaymentStatus = paymentStatus
	if err := s.orderRepo.Update(order); err != nil {
		return nil, err
	}

	updated, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	result := toOrderDTO(updated)
	return &result, nil
}

func (s *orderService) GenerateInvoicePDF(id, requesterID uint, role string) ([]byte, string, error) {
	order, err := s.orderRepo.FindByID(id)
	if err != nil {
		return nil, "", err
	}
	if order == nil {
		return nil, "", ErrOrderNotFound
	}
	if !strings.EqualFold(strings.TrimSpace(role), "admin") && order.UserID != requesterID {
		return nil, "", ErrForbiddenOrderAccess
	}

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// Logo placeholder.
	pdf.Rect(10, 10, 25, 15, "")
	pdf.SetFont("Arial", "B", 16)
	pdf.SetXY(40, 12)
	pdf.Cell(0, 8, "INVOICE")

	pdf.SetFont("Arial", "", 11)
	pdf.SetXY(40, 20)
	pdf.Cell(0, 6, "Invoice Number: "+order.InvoiceNumber)
	pdf.Ln(12)

	pdf.SetFont("Arial", "", 11)
	pdf.Cell(0, 7, "Customer: "+order.User.Name)
	pdf.Ln(7)
	pdf.Cell(0, 7, "Tanggal: "+order.CreatedAt.UTC().Format("2006-01-02 15:04:05"))
	pdf.Ln(10)

	headers := []string{"Produk", "Qty", "Price", "Subtotal"}
	widths := []float64{85, 25, 35, 35}

	pdf.SetFont("Arial", "B", 11)
	for index, header := range headers {
		pdf.CellFormat(widths[index], 8, header, "1", 0, "C", false, 0, "")
	}
	pdf.Ln(-1)

	pdf.SetFont("Arial", "", 10)
	for _, item := range order.OrderItems {
		values := []string{
			item.Product.Name,
			fmt.Sprintf("%d", item.Quantity),
			fmt.Sprintf("%.2f", item.Price),
			fmt.Sprintf("%.2f", item.Subtotal),
		}
		for index, value := range values {
			pdf.CellFormat(widths[index], 8, value, "1", 0, "L", false, 0, "")
		}
		pdf.Ln(-1)
	}

	pdf.Ln(6)
	pdf.SetFont("Arial", "B", 11)
	pdf.Cell(0, 7, fmt.Sprintf("Grand Total: %.2f", order.TotalPrice))
	pdf.Ln(7)
	pdf.Cell(0, 7, "Status: "+order.Status)
	pdf.Ln(7)
	pdf.Cell(0, 7, "Payment Status: "+order.PaymentStatus)

	var buffer bytes.Buffer
	if err := pdf.Output(&buffer); err != nil {
		return nil, "", err
	}

	filename := order.InvoiceNumber + ".pdf"
	return buffer.Bytes(), filename, nil
}

func toOrderDTO(order *models.Order) dto.OrderResponse {
	items := make([]dto.OrderItemResponse, 0, len(order.OrderItems))
	for _, item := range order.OrderItems {
		items = append(items, dto.OrderItemResponse{
			ID:       item.ID,
			Product:  item.Product.Name,
			Quantity: item.Quantity,
			Price:    item.Price,
			Subtotal: item.Subtotal,
		})
	}

	return dto.OrderResponse{
		ID:              order.ID,
		InvoiceNumber:   order.InvoiceNumber,
		Customer:        order.User.Name,
		TotalPrice:      order.TotalPrice,
		Status:          order.Status,
		PaymentStatus:   order.PaymentStatus,
		ShippingAddress: order.ShippingAddress,
		CreatedAt:       order.CreatedAt.UTC().Format(time.RFC3339),
		Items:           items,
	}
}
