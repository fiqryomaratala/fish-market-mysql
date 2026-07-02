package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/config"
)

var ErrPaymentGatewayNotConfigured = errors.New("payment gateway not configured")
var ErrPaymentWebhookUnauthorized = errors.New("payment webhook unauthorized")

type CreatePaymentLinkInput struct {
	ExternalID         string
	Amount             float64
	PayerName          string
	PayerEmail         string
	Description        string
	SuccessRedirectURL string
	FailureRedirectURL string
}

type CreatePaymentLinkResult struct {
	ID         string
	InvoiceURL string
	Status     string
}

type PaymentWebhookPayload struct {
	ExternalID string `json:"external_id"`
	Status     string `json:"status"`
	PaidAt     string `json:"paid_at"`
}

type PaymentGatewayService interface {
	CreatePaymentLink(input CreatePaymentLinkInput) (*CreatePaymentLinkResult, error)
	ParseWebhook(request *http.Request) (*PaymentWebhookPayload, error)
}

type xenditPaymentService struct {
	apiKey       string
	webhookToken string
	baseURL      string
	httpClient   *http.Client
}

func NewXenditPaymentService(cfg *config.Config) PaymentGatewayService {
	return &xenditPaymentService{
		apiKey:       strings.TrimSpace(cfg.XenditAPIKey),
		webhookToken: strings.TrimSpace(cfg.XenditWebhookToken),
		baseURL:      "https://api.xendit.co",
		httpClient: &http.Client{
			Timeout: 20 * time.Second,
		},
	}
}

func (s *xenditPaymentService) CreatePaymentLink(input CreatePaymentLinkInput) (*CreatePaymentLinkResult, error) {
	if s.apiKey == "" {
		return nil, ErrPaymentGatewayNotConfigured
	}

	payload := map[string]interface{}{
		"external_id":          input.ExternalID,
		"amount":               input.Amount,
		"payer_email":          input.PayerEmail,
		"description":          input.Description,
		"success_redirect_url": input.SuccessRedirectURL,
		"failure_redirect_url": input.FailureRedirectURL,
		"currency":             "IDR",
	}
	if strings.TrimSpace(input.PayerName) != "" {
		payload["customer"] = map[string]interface{}{
			"given_names": input.PayerName,
			"email":       input.PayerEmail,
		}
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequest(http.MethodPost, s.baseURL+"/v2/invoices", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	request.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(s.apiKey+":")))
	request.Header.Set("Content-Type", "application/json")

	response, err := s.httpClient.Do(request)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return nil, fmt.Errorf("xendit create invoice failed with status %d", response.StatusCode)
	}

	var result struct {
		ID         string `json:"id"`
		InvoiceURL string `json:"invoice_url"`
		Status     string `json:"status"`
	}
	if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &CreatePaymentLinkResult{
		ID:         strings.TrimSpace(result.ID),
		InvoiceURL: strings.TrimSpace(result.InvoiceURL),
		Status:     strings.TrimSpace(result.Status),
	}, nil
}

func (s *xenditPaymentService) ParseWebhook(request *http.Request) (*PaymentWebhookPayload, error) {
	if s.webhookToken == "" {
		return nil, ErrPaymentGatewayNotConfigured
	}
	if strings.TrimSpace(request.Header.Get("x-callback-token")) != s.webhookToken {
		return nil, ErrPaymentWebhookUnauthorized
	}

	var payload PaymentWebhookPayload
	if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
		return nil, err
	}

	payload.ExternalID = strings.TrimSpace(payload.ExternalID)
	payload.Status = strings.TrimSpace(strings.ToUpper(payload.Status))

	if payload.ExternalID == "" {
		return nil, errors.New("external_id is required")
	}

	return &payload, nil
}
