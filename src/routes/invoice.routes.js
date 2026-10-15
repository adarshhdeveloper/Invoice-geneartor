import {Router} from "express";
import * as invoiceController from "../controllers/invoice.controller.js";
const router = Router();

/**
 * @router POST /api/invoices/parse
 * @desc Parse invoice data from the request body
 * @access Public
 */
router.post("/parse",invoiceController.parseInvoice);

/**
 * @router GET /api/invoices/getInvoices
 * @desc Get top 10 invoices from the database
 * @access Public
 */
router.get("/getInvoices", invoiceController.getInvoices);


export default router;