const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice'); // Adjust path as needed

// 1. CREATE a new Facture
router.post('/invoices', async (req, res) => {
  try {
      const inputDate=new Date(req.body.date)
      const startOfDay=new Date(inputDate)
      startOfDay.setUTCHours(0,0,0,0)
      const endOfDay=new Date(inputDate)
      endOfDay.setUTCHours(23,59,59,999)
    const existing = await Invoice.findOne({date:{
        $gte:startOfDay,
        $lte:endOfDay
    }})
    if (existing) {
        throw new Error('Une facture est déjà enregistrée pour cette date')
       } else {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice)
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

// 2. READ ALL Factures (with option to populate user details)
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('user', 'name email'); // Adjust fields as needed
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ Factures between Date X (startDate) and Date Y (endDate)
router.get('/invoices/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Veuillez fournir startDate et endDate' });
    }

    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const invoices = await Invoice.find({
      date: {
        $gte: start,
        $lte: end
      }
    }).populate('user', 'name email');

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// 3. READ ONE Facture by ID
router.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('user');
    if (!invoice) {
      return res.status(404).json({ error: 'Facture non trouvée' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE a Facture by ID
router.put('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res.status(404).json({ error: 'Facture non trouvée' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. DELETE a Facture by ID
router.delete('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Facture non trouvée' });
    }
    res.status(200).json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
