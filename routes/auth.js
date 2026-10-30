const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const requireAuth = require("../middleware/auth");

// Create a new user
router.post("/auth/signup", authCtrl.createUser);

// Log user in
router.post("/auth/signin", authCtrl.authenticateUser);
router.get("/auth/profile", requireAuth, authCtrl.getProfile);

module.exports = router;
