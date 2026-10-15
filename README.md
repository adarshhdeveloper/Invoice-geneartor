# Smart Invoice Parser API

A REST API built with Node.js, Express.js, and SQLite that extracts structured invoice data from plain text using regex and rule-based parsing.

## Features

- Parse invoice text into structured JSON.
- Extract invoice number, vendor name, date, subtotal, tax, total, and currency.
- Validate required fields and invoice totals.
- Return warnings when totals do not match.
- Store successfully parsed invoices in SQLite.
- Retrieve the latest 10 invoices.
- Prevent duplicate invoice numbers.
- Validate empty input and text exceeding 10,000 characters.
- Health check endpoint.

## Tech Stack

- Node.js
- Express.js
- SQLite with `better-sqlite3`
- JavaScript (ES Modules)
- Postman / cURL

## Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   └── invoice.controller.js
│   ├── routes/
│   │   └── invoice.routes.js
│   ├── services/
│   │   └── invoice-parser.service.js
│   └── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
npm install express better-sqlite3 dotenv
```


### 3. Start the server

```bash
npm run dev
```

Or, if no development script is configured:

```bash
node server.js
```

The API will run at `http://localhost:3000`.

## API Endpoints

### 1. Health Check

**GET** `/health`

Response:

```json
{
  "status": "ok"
}
```

### 2. Parse Invoice

**POST** `/api/invoices/parse`

Header:

```text
Content-Type: application/json
```

Request body:

```json
{
  "text": "Invoice No: INV-1001\nVendor: ABC Packaging\nDate: 2026-10-15\nSubtotal: 1000.00\nTax: 180.00\nTotal: 1180.00\nCurrency: INR"
}
```

Successful response: `201 Created`

```json
{
  "id": 1,
  "invoiceNumber": "INV-1001",
  "vendorName": "ABC Packaging",
  "invoiceDate": "2026-10-15",
  "subtotal": 1000,
  "taxAmount": 180,
  "grandTotal": 1180,
  "currency": "INR",
  "totalsMatch": true,
  "parserMethod": "rules",
  "warnings": []
}
```

### 3. Get Latest Invoices

**GET** `/api/invoices`

Returns the latest 10 stored invoices.

Example response:

```json
{
  "count": 1,
  "invoices": [
    {
      "id": 1,
      "invoice_number": "INV-1001",
      "vendor_name": "ABC Packaging",
      "invoice_date": "2026-10-15",
      "subtotal": 1000,
      "tax_amount": 180,
      "grand_total": 1180,
      "currency": "INR"
    }
  ]
}
```

## Validation and Error Handling

| Scenario | HTTP status |
|---|---:|
| Successful parsing and storage | `201` |
| Empty or missing text | `400` |
| Text exceeds 10,000 characters | `400` |
| Missing or invalid invoice fields | `422` |
| Duplicate invoice number | `409` |
| Server or database error | `500` |

If the subtotal plus tax does not match the grand total within ₹0.01, the API returns a warning and sets `totalsMatch` to `false`.

## Testing

Test the endpoints using Postman:

1. Check `GET /health`.
2. Send valid invoice text to `POST /api/invoices/parse`.
3. Verify the extracted fields and database storage.
4. Call `GET /api/invoices/getInvoices` to retrieve saved latest 10 invoices.
5. Test empty input, missing fields, oversized text, duplicate invoice numbers, and incorrect totals.

## Parsing Approach

The parser uses regular expressions and string matching to extract labelled invoice fields. It does not require an AI model, PDF processing, image uploads, or OCR.

Unrecognized fields are returned as `null` and reported through warnings rather than being invented.

## Limitations

- Accepts plain text only.
- Input must use recognizable field labels.
- Does not process PDF or image files.
- Rule-based extraction may not support every invoice format.

## License

This project is intended for learning and development purposes.
