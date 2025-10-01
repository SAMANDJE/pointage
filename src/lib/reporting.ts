import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';
import { format } from 'date-fns';
import type { BreakfastSession } from '@shared/types';
const generateReportTitle = (session: BreakfastSession) => {
  // Replace hyphens with slashes to parse the date in the local timezone,
  // avoiding UTC conversion issues.
  const localDate = new Date(session.date.replace(/-/g, '/'));
  return `Breakfast Service Report - ${format(localDate, 'MMMM d, yyyy')}`;
};
const generateReportData = (session: BreakfastSession) => {
  const sortedCheckIns = [...session.checkIns].sort((a, b) => a.timestamp - b.timestamp);
  return sortedCheckIns.map((record) => ({
    roomNumber: record.roomNumber,
    checkInTime: format(new Date(record.timestamp), 'p'),
  }));
};
export const exportToPDF = (session: BreakfastSession) => {
  const doc = new jsPDF();
  const reportTitle = generateReportTitle(session);
  const reportData = generateReportData(session);
  doc.text(reportTitle, 14, 20);
  doc.text(`Total Guests Served: ${session.checkIns.length}`, 14, 30);
  autoTable(doc, {
    startY: 40,
    head: [['Room Number', 'Check-in Time']],
    body: reportData.map(Object.values),
    theme: 'striped',
    headStyles: { fillColor: [31, 41, 55] }, // Cool Gray 800
  });
  doc.save(`Aurore_Breakfast_Report_${session.date}.pdf`);
};
export const exportToExcel = (session: BreakfastSession) => {
  const reportTitle = generateReportTitle(session);
  const reportData = generateReportData(session);
  const worksheetData = [
    [reportTitle],
    [],
    [`Total Guests Served: ${session.checkIns.length}`],
    [],
    ['Room Number', 'Check-in Time'],
    ...reportData.map(Object.values),
  ];
  const worksheet = utils.aoa_to_sheet(worksheetData);
  // Set column widths
  worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }];
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Breakfast Report');
  writeFile(workbook, `Aurore_Breakfast_Report_${session.date}.xlsx`);
};