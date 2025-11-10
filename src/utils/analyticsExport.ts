import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export interface AnalyticsData {
  revenueData: any[];
  deploymentData: any[];
  satisfactionData: any[];
  trendingSolutions: any[];
  vendorData: any[];
}

export interface ExportFilters {
  dateRange: string;
  vendor?: string;
  category?: string;
}

// Export to CSV
export const exportToCSV = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to Excel
export const exportToExcel = (analyticsData: AnalyticsData, filters: ExportFilters) => {
  const wb = XLSX.utils.book_new();

  // Revenue sheet
  const revenueSheet = XLSX.utils.json_to_sheet(
    analyticsData.revenueData.map(item => ({
      Month: item.month,
      Revenue: `$${item.revenue.toLocaleString()}`,
      'Growth %': `${item.growth.toFixed(1)}%`
    }))
  );
  XLSX.utils.book_append_sheet(wb, revenueSheet, 'Revenue');

  // Vendor Performance sheet
  const vendorSheet = XLSX.utils.json_to_sheet(
    analyticsData.vendorData.map(item => ({
      Vendor: item.vendor,
      Revenue: `$${item.revenue.toLocaleString()}`,
      'Market Share %': `${item.share}%`
    }))
  );
  XLSX.utils.book_append_sheet(wb, vendorSheet, 'Vendor Performance');

  // Deployment Success sheet
  const deploymentSheet = XLSX.utils.json_to_sheet(
    analyticsData.deploymentData.map(item => ({
      Period: item.week,
      Successful: item.successful,
      Failed: item.failed,
      Total: item.total,
      'Success Rate %': `${((item.successful / item.total) * 100).toFixed(1)}%`
    }))
  );
  XLSX.utils.book_append_sheet(wb, deploymentSheet, 'Deployments');

  // Satisfaction sheet
  const satisfactionSheet = XLSX.utils.json_to_sheet(
    analyticsData.satisfactionData.map(item => ({
      Category: item.category,
      'Score (out of 5)': item.score
    }))
  );
  XLSX.utils.book_append_sheet(wb, satisfactionSheet, 'Satisfaction');

  // Trending Solutions sheet
  const trendingSheet = XLSX.utils.json_to_sheet(
    analyticsData.trendingSolutions.map(item => ({
      Solution: item.name,
      Vendor: item.vendor,
      Deployments: item.deployments,
      'Growth %': `${item.growth}%`,
      Revenue: `$${item.revenue.toLocaleString()}`,
      Rating: item.rating,
      'Success Rate %': `${item.successRate}%`
    }))
  );
  XLSX.utils.book_append_sheet(wb, trendingSheet, 'Trending Solutions');

  // Write file
  XLSX.writeFile(wb, `partner_analytics_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// Export to PDF
export const exportToPDF = (analyticsData: AnalyticsData, filters: ExportFilters) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Partner Analytics Report', 14, 22);
  
  // Date and filters
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 32);
  doc.text(`Date Range: ${filters.dateRange}`, 14, 38);
  if (filters.vendor && filters.vendor !== 'all') {
    doc.text(`Vendor: ${filters.vendor}`, 14, 44);
  }

  let yPosition = filters.vendor && filters.vendor !== 'all' ? 54 : 48;

  // Revenue Summary
  doc.setFontSize(14);
  doc.text('Revenue Summary', 14, yPosition);
  yPosition += 6;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Month', 'Revenue', 'Growth %']],
    body: analyticsData.revenueData.map(item => [
      item.month,
      `$${item.revenue.toLocaleString()}`,
      `${item.growth.toFixed(1)}%`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Vendor Performance
  doc.setFontSize(14);
  doc.text('Vendor Performance', 14, yPosition);
  yPosition += 6;

  autoTable(doc, {
    startY: yPosition,
    head: [['Vendor', 'Revenue', 'Market Share %']],
    body: analyticsData.vendorData.map(item => [
      item.vendor,
      `$${item.revenue.toLocaleString()}`,
      `${item.share}%`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Add new page if needed
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Trending Solutions
  doc.setFontSize(14);
  doc.text('Top Trending Solutions', 14, yPosition);
  yPosition += 6;

  autoTable(doc, {
    startY: yPosition,
    head: [['Solution', 'Vendor', 'Deployments', 'Growth %', 'Rating']],
    body: analyticsData.trendingSolutions.slice(0, 5).map(item => [
      item.name,
      item.vendor,
      item.deployments.toString(),
      `${item.growth}%`,
      item.rating.toString()
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });

  // Save
  doc.save(`partner_analytics_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
