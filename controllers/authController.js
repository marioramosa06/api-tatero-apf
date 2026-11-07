const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserFriendlyMessage = (error, fallbackMessage) => {
  const rawMessage = error?.message || error?.error || error || "";
  const message = String(rawMessage).trim();

  if (!message) return fallbackMessage;

  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("e11000") ||
    lowerMessage.includes("already") ||
    lowerMessage.includes("déjà") ||
    lowerMessage.includes("duplicate")
  ) {
    return "Cette adresse e-mail est déjà utilisée. Essayez une autre adresse ou connectez-vous.";
  }

  if (lowerMessage.includes("email") && lowerMessage.includes("valid")) {
    return "Veuillez saisir une adresse e-mail valide.";
  }

  if (lowerMessage.includes("mot de passe") || lowerMessage.includes("password")) {
    return "Le mot de passe est incorrect. Veuillez réessayer.";
  }

  if (lowerMessage.includes("nom") || lowerMessage.includes("genre") || lowerMessage.includes("travail")) {
    return message;
  }

  return fallbackMessage;
};

module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "name gender email workAt createdAt",
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// create new user
module.exports.createUser = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "").trim().toLowerCase();
    const plainPassword = String(req.body.password || "");

    if (!normalizedEmail || !plainPassword) {
      return res.status(400).json({
        message: "Veuillez fournir une adresse e-mail et un mot de passe valides.",
      });
    }

    // 1. Check if user already exists
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(409).json({
        message: "Cette adresse e-mail est déjà utilisée. Essayez une autre adresse ou connectez-vous.",
      });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    req.body.password = hashedPassword;
    req.body.email = normalizedEmail;

    // 3. Create and save new user
    const newUser = await User.create(req.body);
    console.log("v user created", newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("x error creating new user", error.message);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "Cette adresse e-mail est déjà utilisée. Essayez une autre adresse ou connectez-vous.",
      });
    }

    if (error?.name === "ValidationError") {
      const validationMessage = Object.values(error.errors || {})[0]?.message;
      return res.status(400).json({
        message: getUserFriendlyMessage(validationMessage, "Les informations saisies sont incomplètes ou invalides."),
      });
    }

    return res.status(400).json({
      message: getUserFriendlyMessage(error, "Impossible de créer votre compte pour le moment."),
    });
  }
};

// authenticate user
module.exports.authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        hasError: true,
        message: "Veuillez saisir votre adresse e-mail et votre mot de passe.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    // check the user email
    if (!user) {
      return res.status(404).json({
        hasError: true,
        message: "Aucun compte trouvé pour cette adresse e-mail.",
      });
    }

    // verify user password
    const isValidPassword = await bcrypt.compare(String(password), user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        hasError: true,
        message: "Le mot de passe est incorrect. Veuillez réessayer.",
      });
    }

    // generate token
    const secret = process.env.JWT_SECRET || "tatero-dev-secret";
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "5d",
    });
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      hasError: false,
      message: "Connexion réussie",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      hasError: true,
      message: "Connexion impossible pour le moment. Vérifiez vos identifiants ou réessayez plus tard.",
    });
  }
};
