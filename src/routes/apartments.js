const express = require("express");
const router = express.Router();
const multer = require("multer");
const { validateCSVFile } = require("../middleware/fileValidation");
const { importApartments, exportApartments } = require("../controllers/apartmentImportExportController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
} = require("../controllers/apartmentController");

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/import", isAuthenticated,isAdmin,
  upload.single('file'),
  validateCSVFile,
  importApartments
);
router.get("/export",isAuthenticated,isAdmin, exportApartments);

router.get("/", getApartments);
router.get("/:id", getApartmentById);
router.post("/", isAuthenticated, isAdmin, createApartment);
router.put("/:id", isAuthenticated, isAdmin, updateApartment);
router.delete("/:id", isAuthenticated, isAdmin, deleteApartment);

module.exports = router;