const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'identifiant de l'utilisateur est obligatoire."],
    },
    date: {
      type: Date,
      required: [true, "La date de la facture est obligatoire."],
    },
    nbP: {
      type: Number,
      min: [0, "Le nombre de patients ne peut pas être négatif."],
      required: [true, "Le nombre de patients est obligatoire."],
    },
    nbOf: {
      type: Number,
      min: [0, "Le nombre d'ordonnances ne peut pas être négatif."],
      required: [true, "Le nombre d'ordonnances est obligatoire."],
    },
    amount: {
      type: Number,
      min: [0, "Le montant total de la facture ne peut pas être négatif."],
      required: [true, "Le montant de la facture est obligatoire."],
    },
    averageCost: {
      type: Number,
      min: [0, "Le coût moyen par patient ne peut pas être négatif."],
      required: [true, "Le coût moyen par patient est obligatoire."],
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
