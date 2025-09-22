const express = require("express");
const router = express.Router();
const {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
} = require("../controllers/apartmentController");

router.get("/", getApartments);
router.get("/:id", getApartmentById);
router.post("/", createApartment);
router.put("/:id", updateApartment);
router.delete("/:id", deleteApartment);

module.exports = router;