package handlers

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/services"
	"github.com/fiqryomaratala/backend/internal/utils"
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

// GetHarvestReport godoc
// @Summary Get harvest report
// @Description Get harvest report with optional filters
// @Tags Reports
// @Produce json
// @Security BearerAuth
// @Param start_date query string false "Start date (YYYY-MM-DD)"
// @Param end_date query string false "End date (YYYY-MM-DD)"
// @Param pond_id query int false "Pond ID"
// @Param fish_type query string false "Fish type"
// @Success 200 {object} APIResponse
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /reports/harvest [get]
func (h *ReportHandler) GetHarvestReport(c *gin.Context) {
	filter, err := parseHarvestReportFilter(c)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	data, err := h.reportService.GetHarvestReport(*filter)
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

// GetProductionReport godoc
// @Summary Get production report
// @Description Get production report grouped by pond
// @Tags Reports
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /reports/production [get]
func (h *ReportHandler) GetProductionReport(c *gin.Context) {
	data, err := h.reportService.GetProductionReport()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

// GetFeedingReport godoc
// @Summary Get feeding report
// @Description Get feeding report with total feed usage
// @Tags Reports
// @Produce json
// @Security BearerAuth
// @Success 200 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /reports/feeding [get]
func (h *ReportHandler) GetFeedingReport(c *gin.Context) {
	data, err := h.reportService.GetFeedingReport()
	if err != nil {
		utils.InternalServerError(c)
		return
	}

	utils.Success(c, "", data)
}

// ExportExcel godoc
// @Summary Export report to Excel
// @Description Export harvest, production, or feeding report to Excel
// @Tags Reports
// @Produce application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// @Security BearerAuth
// @Param type query string true "Report type"
// @Param start_date query string false "Start date (YYYY-MM-DD)"
// @Param end_date query string false "End date (YYYY-MM-DD)"
// @Param pond_id query int false "Pond ID"
// @Param fish_type query string false "Fish type"
// @Success 200 {file} binary
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /reports/export/excel [get]
func (h *ReportHandler) ExportExcel(c *gin.Context) {
	filter, err := parseHarvestReportFilter(c)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	content, filename, err := h.exportService.ExportExcel(c.Query("type"), *filter)
	if err != nil {
		if errors.Is(err, services.ErrInvalidReportType) {
			utils.Error(c, http.StatusBadRequest, "Invalid report type")
			return
		}

		utils.InternalServerError(c)
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content)
}

// ExportPDF godoc
// @Summary Export report to PDF
// @Description Export harvest, production, or feeding report to PDF
// @Tags Reports
// @Produce application/pdf
// @Security BearerAuth
// @Param type query string true "Report type"
// @Param start_date query string false "Start date (YYYY-MM-DD)"
// @Param end_date query string false "End date (YYYY-MM-DD)"
// @Param pond_id query int false "Pond ID"
// @Param fish_type query string false "Fish type"
// @Success 200 {file} binary
// @Failure 400 {object} APIResponse
// @Failure 401 {object} APIResponse
// @Failure 403 {object} APIResponse
// @Failure 500 {object} APIResponse
// @Router /reports/export/pdf [get]
func (h *ReportHandler) ExportPDF(c *gin.Context) {
	filter, err := parseHarvestReportFilter(c)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	content, filename, err := h.exportService.ExportPDF(c.Query("type"), *filter)
	if err != nil {
		if errors.Is(err, services.ErrInvalidReportType) {
			utils.Error(c, http.StatusBadRequest, "Invalid report type")
			return
		}

		utils.InternalServerError(c)
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
