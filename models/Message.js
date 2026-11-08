const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    senderName: {
      type: String,
      trim: true,
      required: [true, "Veuillez communiquer votre nom"],
      max: [90, "90 caractères maximum"],
    },
    senderEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Veuillez communiquer votre adresse e-mail"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Veuillez saisir une adresse e-mail valide",
      ],
    },
    subject: {
      type: String,
      trim: true,
      required: [true, "Veuillez saisir un sujet"],
      max: [60, "60 caractères maximum"],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Veuillez saisir votre message"],
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
