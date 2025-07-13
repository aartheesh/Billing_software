import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportDeliveryChallanPDF({ company, billTo, invoice, items, totals, bank }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Helper: Draw header background and details
  function drawHeader(doc, page = 1) {
    // Blue background
    doc.setFillColor(240, 248, 255); // Light blue
    doc.rect(0, 0, 210, 40, "F");

    // Logo
    // doc.addImage("https://i.ibb.co/4f3kF5z/ro-logo.png", "PNG", 10, 8, 22, 22);

    // Company name and tagline
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(company.name, 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(company.tagline, 105, 21, { align: "center" });

    // Address and contact
    doc.setFontSize(8);
    doc.text(company.address, 105, 26, { align: "center" });
    doc.text(`E-Mail: ${company.email}`, 105, 30, { align: "center" });

    // GST and phone
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Cell: ${company.phone}`, 170, 12);
    doc.setTextColor(255, 0, 0);
    doc.text(`GST NO: ${company.gst}`, 170, 17);

    // Bill To and Invoice Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("BILL TO:", 10, 38);
    doc.text(billTo.name, 30, 38);
    doc.text(billTo.address, 30, 42);

    doc.text("INVOICE NO:", 120, 38);
    doc.text(String(invoice.no), 145, 38);
    doc.text("INVOICE DATE:", 120, 42);
    doc.text(String(invoice.date), 145, 42);
    doc.text("INVOICE TYPE:", 120, 46);
    doc.text(String(invoice.type), 145, 46);
  }

  // Table columns
  const tableColumns = [
    { header: "S.NO", dataKey: "key" },
    { header: "DESCRIPTION OF GOODS", dataKey: "description" },
    { header: "HSN CODE", dataKey: "hsn" },
    { header: "QUANTITY", dataKey: "qty" },
    { header: "RATE", dataKey: "rate" },
    { header: "PER", dataKey: "per" },
    { header: "AMOUNT", dataKey: "amount" },
  ];

  // Table data
  const tableRows = items.map((item) => ({
    ...item,
    rate: item.rate.toLocaleString(),
    amount: item.amount.toLocaleString(),
  }));

  // Draw header on first page
  drawHeader(doc, 1);

  // Table with custom margin to leave space for header
  autoTable(doc, {
    head: [tableColumns.map(col => col.header)],
    body: tableRows.map(row => tableColumns.map(col => row[col.dataKey])),
    startY: 50,
    margin: { left: 10, right: 10 },
    styles: { fontSize: 9, cellPadding: 2 },
    didDrawPage: (data) => {
      // Draw header on every page
      drawHeader(doc, doc.internal.getNumberOfPages());
    },
  });

  // Add summary on a new page
  doc.addPage();
  let y = 20;
  doc.setFontSize(12);
  doc.text("Summary", 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(10);
  doc.text(`SUB TOTAL: ${totals.subtotal.toLocaleString()}`, 20, y);
  y += 7;
  doc.text(`SGST 9%: ${totals.sgst.toLocaleString()}`, 20, y);
  y += 7;
  doc.text(`CGST 9%: ${totals.cgst.toLocaleString()}`, 20, y);
  y += 7;
  doc.text(`Rounded Off (+/-): ${totals.roundoff.toLocaleString()}`, 20, y);
  y += 7;
  doc.text(`TOTAL: ${totals.total.toLocaleString()}`, 20, y);
  y += 14;
  doc.text(`Amount in Words: ${totals.words}`, 20, y);
  y += 14;

  doc.text("BANK DETAILS", 20, y);
  y += 7;
  doc.text(`Bank name: ${bank.name}`, 20, y);
  y += 7;
  doc.text(`Account Name: ${bank.accName}`, 20, y);
  y += 7;
  doc.text(`Account No: ${bank.accNo}`, 20, y);
  y += 7;
  doc.text(`IFSC Code: ${bank.ifsc}`, 20, y);
  y += 7;
  doc.text(`Branch: ${bank.branch}`, 20, y);

  // Signature
  doc.text(`FOR ${company.name}`, 150, y + 14);
  doc.text("Authorised signature", 150, y + 28);

  doc.save("DeliveryChallan.pdf");
}