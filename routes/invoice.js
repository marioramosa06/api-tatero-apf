const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const requireAuth = require("../middleware/auth");

router.use(requireAuth);
router.post("/invoices", invoiceController.createInvoice);
router.get("/invoices", invoiceController.getInvoices);
router.get("/invoices/range", invoiceController.getInvoicesByRange);
router.get("/invoices/:id", invoiceController.getInvoiceById);
router.put("/invoices/:id", invoiceController.updateInvoice);
router.delete("/invoices/:id", invoiceController.deleteInvoice);

module.exports = router;
