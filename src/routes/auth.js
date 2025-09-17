const express = require("express");
const router = express.Router();
const { register, login, logout, getCurrentUser } = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", isAuthenticated, getCurrentUser);

module.exports = router;