const express = require("express");
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  getReservationById,
  cancelReservation,
  getAllReservations
} = require("../controllers/reservationController");
const { isAuthenticated } = require("../middleware/auth");


router.use(isAuthenticated);

// Crează rezervare nouă
router.post("/", createReservation);

router.get("/my-reservations", getUserReservations);

router.get("/all", getAllReservations);

// Obține o rezervare specifică
router.get("/:id", getReservationById);

// Anulează o rezervare
router.delete("/:id", cancelReservation);

module.exports = router;