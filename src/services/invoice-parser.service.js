const getMatch = (text, regex) => {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
};

const getAmount = (text, regex) => {
  const value = getMatch(text, regex);

  if (!value) return null;

  const amount = Number(value.replace(/,/g, ""));

  return Number.isFinite(amount) ? amount : null;
};

export const parseInvoiceText = (text) => {
  const invoiceNumber = getMatch(
    text,
    /^\s*Invoice\s*(?:No\.?|Number|#)\s*:\s*(.+?)\s*$/im
  );

  const vendorName = getMatch(
    text,
    /^\s*Vendor(?:\s*Name)?\s*:\s*(.+?)\s*$/im
  );

  const invoiceDate = getMatch(
    text,
    /^\s*Date\s*:\s*(\d{4}-\d{2}-\d{2})\s*$/im
  );

  const subtotal = getAmount(
    text,
    /^\s*Subtotal\s*:\s*[₹$]?\s*([\d,]+(?:\.\d{1,2})?)\s*$/im
  );

  const taxAmount = getAmount(
    text,
    /^\s*(?:Tax(?:\s*Amount)?|GST)\s*:\s*[₹$]?\s*([\d,]+(?:\.\d{1,2})?)\s*$/im
  );

  const grandTotal = getAmount(
    text,
    /^\s*(?:Grand\s*Total|Total)\s*:\s*[₹$]?\s*([\d,]+(?:\.\d{1,2})?)\s*$/im
  );

  const currency = getMatch(
    text,
    /^\s*Currency\s*:\s*([A-Za-z]{3})\s*$/im
  );

  return {
    invoiceNumber,
    vendorName,
    invoiceDate,
    subtotal,
    taxAmount,
    grandTotal,
    currency: currency ? currency.toUpperCase() : null,
  };
};