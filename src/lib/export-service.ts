import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as Papa from 'papaparse';
import { 
  BookingReportData, 
  LifeguardReportData, 
  ReportType,
  BOOKING_FIELD_DEFINITIONS,
  LIFEGUARD_FIELD_DEFINITIONS,
  FieldDefinition,
  ReportSummary,
} from './report-types';
import { SingaporeTime } from './singapore-time';

export class ExportService {
  static generateCSV(
    data: BookingReportData[] | LifeguardReportData[],
    fields: string[],
    reportType: ReportType
  ): string {
    const fieldDefinitions = reportType === 'bookings' 
      ? BOOKING_FIELD_DEFINITIONS 
      : LIFEGUARD_FIELD_DEFINITIONS;

    // Create headers
    const headers = fields.map(fieldKey => {
      const field = fieldDefinitions.find(f => f.key === fieldKey);
      return field?.label || fieldKey;
    });

    // Format data rows
    const rows = data.map(row => 
      fields.map(fieldKey => {
        const value = row[fieldKey as keyof typeof row];
        const field = fieldDefinitions.find(f => f.key === fieldKey);
        
        return this.formatCellValue(value, field?.type || 'string');
      })
    );

    // Combine headers and rows
    const csvData = [headers, ...rows];

    // Generate CSV string
    return Papa.unparse(csvData, {
      quotes: true,
      delimiter: ',',
      header: false,
    });
  }

  static async generatePDF(
    data: BookingReportData[] | LifeguardReportData[],
    fields: string[],
    reportType: ReportType,
    summary: ReportSummary,
    dateRange: { startDate: string; endDate: string }
  ): Promise<Uint8Array> {
    const doc = new jsPDF({
      orientation: fields.length > 6 ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;

    // Header
    this.addPDFHeader(doc, reportType, dateRange, pageWidth, margin);

    // Summary Statistics
    const summaryHeight = this.addPDFSummary(doc, summary, reportType, margin, 140);

    // Table
    this.addPDFTable(doc, data, fields, reportType, margin, summaryHeight + 40);

    // Footer
    this.addPDFFooter(doc, pageHeight, margin);

    return new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  }

  private static addPDFHeader(
    doc: jsPDF, 
    reportType: ReportType, 
    dateRange: { startDate: string; endDate: string },
    pageWidth: number,
    margin: number
  ) {
    // Company/Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Bearded Lifeguard', margin, margin + 20);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    const title = reportType === 'bookings' ? 'Bookings Report' : 'Lifeguards Report';
    doc.text(title, margin, margin + 45);

    // Date range
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const dateRangeText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    doc.text(`Report Period: ${dateRangeText}`, margin, margin + 70);

    // Generation timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - margin - 150, margin + 20);

    // Separator line
    doc.setLineWidth(1);
    doc.line(margin, margin + 85, pageWidth - margin, margin + 85);
  }

  private static addPDFSummary(
    doc: jsPDF,
    summary: ReportSummary,
    reportType: ReportType,
    margin: number,
    startY: number
  ): number {
    let currentY = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', margin, currentY);
    currentY += 25;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    if (reportType === 'bookings') {
      const stats = [
        `Total Bookings: ${summary.totalRecords.toLocaleString()}`,
        `Total Revenue: $${(summary.totalRevenue || 0).toFixed(2)}`,
        `Average Booking Value: $${(summary.averageBookingValue || 0).toFixed(2)}`,
        `Total Hours: ${(summary.totalHours || 0).toLocaleString()}h`,
      ];

      stats.forEach((stat, index) => {
        doc.text(stat, margin + (index % 2) * 250, currentY + Math.floor(index / 2) * 20);
      });
      currentY += 50;
    } else {
      const stats = [
        `Total Lifeguards: ${summary.totalRecords.toLocaleString()}`,
        `Active Lifeguards: ${(summary.totalActiveLifeguards || 0).toLocaleString()}`,
        `Total Assignments: ${(summary.totalAssignments || 0).toLocaleString()}`,
        `Avg Assignments/Lifeguard: ${(summary.averageAssignmentsPerLifeguard || 0).toFixed(1)}`,
      ];

      stats.forEach((stat, index) => {
        doc.text(stat, margin + (index % 2) * 250, currentY + Math.floor(index / 2) * 20);
      });
      currentY += 50;
    }

    return currentY;
  }

  private static addPDFTable(
    doc: jsPDF,
    data: BookingReportData[] | LifeguardReportData[],
    fields: string[],
    reportType: ReportType,
    margin: number,
    startY: number
  ) {
    const fieldDefinitions = reportType === 'bookings' 
      ? BOOKING_FIELD_DEFINITIONS 
      : LIFEGUARD_FIELD_DEFINITIONS;

    // Prepare table data
    const headers = fields.map(fieldKey => {
      const field = fieldDefinitions.find(f => f.key === fieldKey);
      return field?.label || fieldKey;
    });

    const tableData = data.map(row => 
      fields.map(fieldKey => {
        const value = row[fieldKey as keyof typeof row];
        const field = fieldDefinitions.find(f => f.key === fieldKey);
        
        return this.formatCellValue(value, field?.type || 'string', 'pdf');
      })
    );

    // Generate table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: startY,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: 'middle',
      },
      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Light gray alternating rows
      },
      columnStyles: this.getColumnStyles(fields, fieldDefinitions),
      didDrawPage: (data) => {
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;
        
        doc.setFontSize(10);
        doc.text(
          `Page ${currentPage} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - margin - 60,
          doc.internal.pageSize.getHeight() - 20
        );
      },
    });
  }

  private static getColumnStyles(fields: string[], fieldDefinitions: FieldDefinition[]) {
    const styles: { [key: number]: any } = {};

    fields.forEach((fieldKey, index) => {
      const field = fieldDefinitions.find(f => f.key === fieldKey);
      
      switch (field?.type) {
        case 'currency':
        case 'number':
          styles[index] = { halign: 'right' };
          break;
        case 'date':
          styles[index] = { halign: 'center', cellWidth: 80 };
          break;
        case 'boolean':
          styles[index] = { halign: 'center', cellWidth: 40 };
          break;
        default:
          styles[index] = { halign: 'left' };
      }
    });

    return styles;
  }

  private static addPDFFooter(doc: jsPDF, pageHeight: number, margin: number) {
    const footerY = pageHeight - 30;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Bearded Lifeguard Admin System', margin, footerY);
    
    // Add line above footer
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 10, doc.internal.pageSize.getWidth() - margin, footerY - 10);
  }

  private static formatCellValue(value: any, type: string, format: 'csv' | 'pdf' = 'csv'): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    switch (type) {
      case 'currency':
        return typeof value === 'number' ? `$${value.toFixed(2)}` : String(value);
        
      case 'date':
        try {
          if (format === 'pdf') {
            return SingaporeTime.format(value, 'MMM dd, yyyy');
          } else {
            return SingaporeTime.format(value, 'yyyy-MM-dd HH:mm:ss');
          }
        } catch {
          return String(value);
        }
        
      case 'boolean':
        if (format === 'pdf') {
          return value ? '✓' : '✗';
        } else {
          return value ? 'Yes' : 'No';
        }
        
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
        
      default:
        // Handle string truncation for PDF to prevent overflow
        const stringValue = String(value);
        if (format === 'pdf' && stringValue.length > 30) {
          return stringValue.substring(0, 27) + '...';
        }
        return stringValue;
    }
  }

  static createDownloadBlob(content: string | Uint8Array, type: 'csv' | 'pdf'): Blob {
    if (type === 'csv') {
      return new Blob([content as string], { type: 'text/csv;charset=utf-8;' });
    } else {
      return new Blob([content as BlobPart], { type: 'application/pdf' });
    }
  }

  static generateFileName(reportType: ReportType, format: 'csv' | 'pdf', dateRange: { startDate: string; endDate: string }): string {
    const startDate = new Date(dateRange.startDate).toISOString().split('T')[0];
    const endDate = new Date(dateRange.endDate).toISOString().split('T')[0];
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `${reportType}_report_${startDate}_${endDate}_${timestamp}.${format}`;
  }
}