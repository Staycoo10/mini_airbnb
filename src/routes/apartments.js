const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
} = require("../controllers/apartmentController");

router.get("/", getApartments);
router.get("/:id", getApartmentById);
router.post("/", isAuthenticated, isAdmin, createApartment);
router.put("/:id", isAuthenticated, isAdmin, updateApartment);
router.delete("/:id", isAuthenticated, isAdmin, deleteApartment);

module.exports = router;