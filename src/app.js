import express from "express";
import invoiceRoutes from "./routes/invoice.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/invoices", invoiceRoutes);

export default app;