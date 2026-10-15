  import Database from "better-sqlite3";

  const db = new Database("invoices.db");

  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT NOT NULL UNIQUE,
      vendor_name TEXT NOT NULL,
      invoice_date TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax_amount REAL NOT NULL,
      grand_total REAL NOT NULL,
      currency TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  export default db;