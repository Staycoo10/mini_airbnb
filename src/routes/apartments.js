const express = require("express");
const router = express.Router();
const multer = require("multer");
const { validateCSVFile } = require("../middleware/fileValidation");
const { importApartments, exportApartments } = require("../controllers/apartmentImportExportController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const { getApartments, getApartmentById, createApartment, updateApartment, deleteApartment, getMyApartments } = require("../controllers/apartmentController");
const { addImage, deleteImage, getImages } = require("../controllers/imageController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/import", isAuthenticated, isAdmin, upload.single('file'), validateCSVFile, importApartments);
router.get("/export", isAuthenticated, isAdmin, exportApartments);
router.get("/my-apartments", isAuthenticated, isAdmin, getMyApartments);

router.get("/", getApartments);
router.get("/:id", getApartmentById);
router.post("/", isAuthenticated, isAdmin, createApartment);
router.put("/:id", isAuthenticated, isAdmin, updateApartment);
router.delete("/:id", isAuthenticated, isAdmin, deleteApartment);

// Image routes
router.get("/:id/images", getImages);
router.post("/:id/images", isAuthenticated, isAdmin, addImage);
router.delete("/:id/images/:imageId", isAuthenticated, isAdmin, deleteImage);

module.exports = router;