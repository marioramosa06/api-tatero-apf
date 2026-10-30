const Invoice = require("../models/Invoice");

exports.createInvoice = async (req, res) => {
  try {
    const inputDate = new Date(req.body.date);
    const startOfDay = new Date(inputDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const existing = await Invoice.findOne({
      user: req.userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    if (existing) {
      throw new Error(
        "Vouz avez déjà enregistré une facture pour cette date. Veuillez verifier.",
      );
    }

    const invoice = new Invoice({ ...req.body, user: req.userId });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.userId }).populate(
      "user",
      "name email",
    );
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoicesByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Veuillez fournir startDate et endDate" });
    }

    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const invoices = await Invoice.find({
      user: req.userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).populate("user", "name email");

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("user");
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { ...req.body, user: req.userId },
      { new: true, runValidators: true },
    );
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
