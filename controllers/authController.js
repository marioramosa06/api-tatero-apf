const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// create new user
module.exports.createUser = async (req, res) => {
  try {
    // 1. Check if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(401).json("L'email est déjà utilisé");
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // 3. Create and save new user
    const newUser = await User.create(req.body);
    console.log("v user created", newUser);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error("x error creating new user", error.message);
    return res.status(400).json({ message: error.message });
  }
};

// authenticate user
module.exports.authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    // check the user email
    if (!user) {
      return res.status(404).json({
        hasError: true,
        message: "Utilisateur introuvable. Veuillez verifier l'email.",
      });
    }
    // verify user password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(404).json({
        hasError: true,
        message: "Le mot de passe est invalide",
      });
    }
    // generate token
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "5d",
    });
    // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({
      hasError: false,
      message: "Connexion reussie",
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
      message: "Echec de connexion, Erreur interne du serveur.",
    });
  }
};
