const Message = require("../models/Message");

exports.createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Veuillez saisir votre nom." });
    }

    if (!email || !String(email).trim()) {
      return res.status(400).json({ message: "Veuillez saisir votre adresse e-mail." });
    }

    if (!subject || !String(subject).trim()) {
      return res.status(400).json({ message: "Veuillez saisir un sujet." });
    }

    if (!message || !String(message).trim()) {
      return res.status(400).json({ message: "Veuillez saisir votre message." });
    }

    const newMessage = await Message.create({
      senderName: String(name).trim(),
      senderEmail: String(email).trim().toLowerCase(),
      subject: String(subject).trim(),
      content: String(message).trim(),
    });

    res.status(201).json({
      message: "Votre message a bien été envoyé.",
      data: newMessage,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      const firstError = Object.values(error.errors || {})[0]?.message;
      return res.status(400).json({
        message: firstError || "Les informations du message sont invalides.",
      });
    }

    res.status(500).json({
      message: "Impossible d'envoyer votre message pour le moment. Merci de réessayer plus tard.",
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message introuvable." });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message introuvable." });
    }

    res.status(200).json({ message: "Message supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
