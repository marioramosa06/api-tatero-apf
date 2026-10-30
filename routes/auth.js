const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");

// Create a new user
router.post("/auth/signup", authCtrl.createUser);

// Log user in
router.post("/auth/signin", authCtrl.authenticateUser);

module.exports = router;
