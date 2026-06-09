package handlers

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ReportHandler struct {
	reportService services.ReportService
	exportService services.ExportService
}

func NewReportHandler(reportService services.ReportService, exportService services.ExportService) *ReportHandler {
	return &ReportHandler{
		reportService: reportService,
		exportService: exportService,
	}
}

func (h *ReportHandler) GetHarvestReport(c *gin.Context) {
	filter, err := parseHarvestReportFilter(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	data, err := h.reportService.GetHarvestReport(*filter)
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch harvest report")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *ReportHandler) GetProductionReport(c *gin.Context) {
	data, err := h.reportService.GetProductionReport()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch production report")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *ReportHandler) GetFeedingReport(c *gin.Context) {
	data, err := h.reportService.GetFeedingReport()
	if err != nil {
		ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch feeding report")
		return
	}

	SuccessResponse(c, http.StatusOK, "", data)
}

func (h *ReportHandler) ExportExcel(c *gin.Context) {
	filter, err := parseHarvestReportFilter(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	content, filename, err := h.exportService.ExportExcel(c.Query("type"), *filter)
	if err != nil {
		if errors.Is(err, services.ErrInvalidReportType) {
			ErrorResponse(c, http.StatusBadRequest, "Invalid report type")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to export Excel report")
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content)
}

func (h *ReportHandler) ExportPDF(c *gin.Context) {
	filter, err := parseHarvestReportFilter(c)
	if err != nil {
		ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	content, filename, err := h.exportService.ExportPDF(c.Query("type"), *filter)
	if err != nil {
		if errors.Is(err, services.ErrInvalidReportType) {
			ErrorResponse(c, http.StatusBadRequest, "Invalid report type")
			return
		}

		ErrorResponse(c, http.StatusInternalServerError, "Failed to export PDF report")
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Data(http.StatusOK, "application/pdf", content)
}

func parseHarvestReportFilter(c *gin.Context) (*services.ReportFilter, error) {
	filter := &services.ReportFilter{
		PondID:   parseUintQuery(c.Query("pond_id")),
		FishType: strings.TrimSpace(c.Query("fish_type")),
	}

	startDateValue := strings.TrimSpace(c.Query("start_date"))
	if startDateValue != "" {
		startDate, err := time.Parse(dateLayout, startDateValue)
		if err != nil {
			return nil, errors.New("Start date must use format YYYY-MM-DD")
		}
		filter.StartDate = &startDate
	}

	endDateValue := strings.TrimSpace(c.Query("end_date"))
	if endDateValue != "" {
		endDate, err := time.Parse(dateLayout, endDateValue)
		if err != nil {
			return nil, errors.New("End date must use format YYYY-MM-DD")
		}
		endDate = endDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second)
		filter.EndDate = &endDate
	}

	return filter, nil
}
