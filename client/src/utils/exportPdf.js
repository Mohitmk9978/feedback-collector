import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { labelFor, CATEGORIES, PRIORITIES, STATUSES } from './constants.js';

/**
 * Export a list of feedback rows to a simple PDF table.
 */
export function exportFeedbackPdf(rows, title = 'Feedback export') {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(10);

  const tableData = rows.map((f) => [
    f.title,
    labelFor(CATEGORIES, f.category),
    labelFor(PRIORITIES, f.priority),
    String(f.rating),
    labelFor(STATUSES, f.status),
    f.message?.slice(0, 80) + (f.message?.length > 80 ? '…' : ''),
  ]);

  autoTable(doc, {
    startY: 26,
    head: [['Title', 'Category', 'Priority', 'Rating', 'Status', 'Message']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] },
  });

  doc.save(`feedback-export-${new Date().toISOString().slice(0, 10)}.pdf`);
}
