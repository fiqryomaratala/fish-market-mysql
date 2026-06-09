package services

import (
	"bytes"
	"fmt"
	"strings"
	"time"

	"github.com/fiqryomaratala/backend/internal/dto"
	"github.com/jung-kurt/gofpdf"
	"github.com/xuri/excelize/v2"
)

type ExportService interface {
	ExportExcel(reportType string, filter ReportFilter) ([]byte, string, error)
	ExportPDF(reportType string, filter ReportFilter) ([]byte, string, error)
}

type exportService struct {
	reportService ReportService
}

func NewExportService(reportService ReportService) ExportService {
	return &exportService{reportService: reportService}
}

func (s *exportService) ExportExcel(reportType string, filter ReportFilter) ([]byte, string, error) {
	reportType = strings.TrimSpace(strings.ToLower(reportType))

	file := excelize.NewFile()
	sheet := "Report"
	file.SetSheetName("Sheet1", sheet)

	var (
		headers  []string
		rows     [][]interface{}
		filename string
	)

	switch reportType {
	case "harvest":
		items, err := s.reportService.GetHarvestReport(filter)
		if err != nil {
			return nil, "", err
		}
		headers = []string{"Batch Code", "Pond", "Fish Type", "Harvest Date", "Fish Count", "Total Weight"}
		rows = harvestExcelRows(items)
		filename = "harvest-report.xlsx"
	case "production":
		items, err := s.reportService.GetProductionReport()
		if err != nil {
			return nil, "", err
		}
		headers = []string{"Pond", "Batch", "Fish Count"}
		rows = productionExcelRows(items)
		filename = "production-report.xlsx"
	case "feeding":
		items, err := s.reportService.GetFeedingReport()
		if err != nil {
			return nil, "", err
		}
		headers = []string{"Batch Code", "Feed Type", "Total Feed"}
		rows = feedingExcelRows(items)
		filename = "feeding-report.xlsx"
	default:
		return nil, "", ErrInvalidReportType
	}

	for index, header := range headers {
		cell, _ := excelize.CoordinatesToCellName(index+1, 1)
		file.SetCellValue(sheet, cell, header)
	}

	for rowIndex, row := range rows {
		for colIndex, value := range row {
			cell, _ := excelize.CoordinatesToCellName(colIndex+1, rowIndex+2)
			file.SetCellValue(sheet, cell, value)
		}
	}

	buffer, err := file.WriteToBuffer()
	if err != nil {
		return nil, "", err
	}

	return buffer.Bytes(), filename, nil
}

func (s *exportService) ExportPDF(reportType string, filter ReportFilter) ([]byte, string, error) {
	reportType = strings.TrimSpace(strings.ToLower(reportType))

	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)

	title := reportTitle(reportType)
	if title == "" {
		return nil, "", ErrInvalidReportType
	}

	// Simple logo placeholder box.
	pdf.Rect(10, 10, 18, 12, "")
	pdf.SetXY(30, 12)
	pdf.Cell(0, 8, title)
	pdf.SetFont("Arial", "", 10)
	pdf.SetXY(30, 20)
	pdf.Cell(0, 6, "Export Date: "+time.Now().Format("2006-01-02 15:04:05"))
	pdf.Ln(18)

	var (
		headers  []string
		rows     [][]string
		widths   []float64
		filename string
	)

	switch reportType {
	case "harvest":
		items, err := s.reportService.GetHarvestReport(filter)
		if err != nil {
			return nil, "", err
		}
		headers = []string{"Batch Code", "Pond", "Fish Type", "Harvest Date", "Fish Count", "Total Weight"}
		rows = harvestPDFRows(items)
		widths = []float64{40, 40, 40, 35, 30, 35}
		filename = "harvest-report.pdf"
	case "production":
		items, err := s.reportService.GetProductionReport()
		if err != nil {
			return nil, "", err
		}
		headers = []string{"Pond", "Batch", "Fish Count"}
		rows = productionPDFRows(items)
		widths = []float64{80, 50, 50}
		filename = "production-report.pdf"
	case "feeding":
		items, err := s.reportService.GetFeedingReport()
		if err != nil {
			return nil, "", err
		}
		headers = []string{"Batch Code", "Feed Type", "Total Feed"}
		rows = feedingPDFRows(items)
		widths = []float64{70, 80, 50}
		filename = "feeding-report.pdf"
	default:
		return nil, "", ErrInvalidReportType
	}

	pdf.SetFont("Arial", "B", 10)
	for index, header := range headers {
		pdf.CellFormat(widths[index], 8, header, "1", 0, "C", false, 0, "")
	}
	pdf.Ln(-1)

	pdf.SetFont("Arial", "", 10)
	for _, row := range rows {
		for index, value := range row {
			pdf.CellFormat(widths[index], 8, value, "1", 0, "L", false, 0, "")
		}
		pdf.Ln(-1)
	}

	var buffer bytes.Buffer
	if err := pdf.Output(&buffer); err != nil {
		return nil, "", err
	}

	return buffer.Bytes(), filename, nil
}

func reportTitle(reportType string) string {
	switch reportType {
	case "harvest":
		return "Harvest Report"
	case "production":
		return "Production Report"
	case "feeding":
		return "Feeding Report"
	default:
		return ""
	}
}

func harvestExcelRows(items []dto.HarvestReportItem) [][]interface{} {
	rows := make([][]interface{}, 0, len(items))
	for _, item := range items {
		rows = append(rows, []interface{}{item.BatchCode, item.Pond, item.FishType, item.HarvestDate, item.FishCount, item.TotalWeight})
	}
	return rows
}

func productionExcelRows(items []dto.ProductionReportItem) [][]interface{} {
	rows := make([][]interface{}, 0, len(items))
	for _, item := range items {
		rows = append(rows, []interface{}{item.Pond, item.Batch, item.FishCount})
	}
	return rows
}

func feedingExcelRows(items []dto.FeedingReportItem) [][]interface{} {
	rows := make([][]interface{}, 0, len(items))
	for _, item := range items {
		rows = append(rows, []interface{}{item.BatchCode, item.FeedType, item.TotalFeed})
	}
	return rows
}

func harvestPDFRows(items []dto.HarvestReportItem) [][]string {
	rows := make([][]string, 0, len(items))
	for _, item := range items {
		rows = append(rows, []string{
			item.BatchCode,
			item.Pond,
			item.FishType,
			item.HarvestDate,
			fmt.Sprintf("%d", item.FishCount),
			fmt.Sprintf("%.2f", item.TotalWeight),
		})
	}
	return rows
}

func productionPDFRows(items []dto.ProductionReportItem) [][]string {
	rows := make([][]string, 0, len(items))
	for _, item := range items {
		rows = append(rows, []string{
			item.Pond,
			fmt.Sprintf("%d", item.Batch),
			fmt.Sprintf("%d", item.FishCount),
		})
	}
	return rows
}

func feedingPDFRows(items []dto.FeedingReportItem) [][]string {
	rows := make([][]string, 0, len(items))
	for _, item := range items {
		rows = append(rows, []string{
			item.BatchCode,
			item.FeedType,
			fmt.Sprintf("%.2f", item.TotalFeed),
		})
	}
	return rows
}
