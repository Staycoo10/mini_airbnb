const express = require("express");
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations
} = require("../controllers/reservationController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// user routes
router.post("/", isAuthenticated, createReservation);
router.get("/my", isAuthenticated, getMyReservations);
router.delete("/:id", isAuthenticated, cancelReservation);

// admin route
router.get("/all", isAuthenticated, isAdmin, getAllReservations);

module.exports = router;