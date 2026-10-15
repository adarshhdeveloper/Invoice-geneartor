import { parseInvoiceText } from "../services/invoice-parser.service.js";
import db from "../config/db.js";

export const parseInvoice = (req, res) => {
  try {
    const { text } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        error: "Invoice text is required",
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        error: "Text must not exceed 10000 characters",
      });
    }

    const invoice = parseInvoiceText(text);

    const requiredFields = [
      "invoiceNumber",
      "vendorName",
      "invoiceDate",
      "subtotal",
      "taxAmount",
      "grandTotal",
      "currency",
    ];

    const warnings = requiredFields
      .filter((field) => invoice[field] == null || invoice[field] === "")
      .map((field) => `Missing or invalid field: ${field}`);

    let totalsMatch = null;

    if (
      invoice.subtotal !== null &&
      invoice.taxAmount !== null &&
      invoice.grandTotal !== null
    ) {
      totalsMatch =
        Math.abs(
          invoice.subtotal + invoice.taxAmount - invoice.grandTotal
        ) <= 0.01;

      if (!totalsMatch) {
        warnings.push("Subtotal plus tax does not match grand total");
      }
    }

    if (
      warnings.some((warning) =>
        warning.startsWith("Missing or invalid")
      )
    ) {
      return res.status(422).json({
        ...invoice,
        totalsMatch,
        parserMethod: "rules",
        warnings,
      });
    }

    const result = db.prepare(`
      INSERT INTO invoices (
        invoice_number,
        vendor_name,
        invoice_date,
        subtotal,
        tax_amount,
        grand_total,
        currency
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      invoice.invoiceNumber,
      invoice.vendorName,
      invoice.invoiceDate,
      invoice.subtotal,
      invoice.taxAmount,
      invoice.grandTotal,
      invoice.currency
    );

    return res.status(201).json({
      id: Number(result.lastInsertRowid),
      ...invoice,
      totalsMatch,
      parserMethod: "rules",
      warnings,
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "Invoice number already exists",
      });
    }

    console.error(error.message);

    return res.status(500).json({
      error: "Failed to parse and save invoice",
    });
  }
};

export const getInvoices = (req, res) => {
  try {
    const invoices = db.prepare(`
      SELECT * FROM invoices
      ORDER BY id DESC
      LIMIT 10
    `).all();

    return res.status(200).json({
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      error: "Failed to fetch invoices",
    });
  }
};