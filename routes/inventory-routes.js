// routes/inventory-routes.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/invController");
const validation = require("../utilities/validationMiddleware");

// Inventory by classification
router.get(
  "/classification/:classificationId",
  inventoryController.buildByClassificationId
);

// Vehicle detail
router.get("/detail/:invId", inventoryController.buildVehicleDetail);

// Full inventory list
router.get("/inventory", inventoryController.buildInventory);

// New error route for testing 500
router.get("/error", (req, res, next) => {
  next(new Error("Intentional 500 error for testing (footer link)"));
});

// ========================
// W04 additions
// ========================

// Inventory management page
router.get("/management", inventoryController.buildManagement);

// Process new classification
router.post(
  "/classification/add",
  validation.validateClassification,
  inventoryController.addClassification
);

// Show add-vehicle form
router.get("/vehicle/add", inventoryController.buildAddVehicle);

// Process new vehicle
router.post(
  "/vehicle/add",
  validation.validateVehicle,
  inventoryController.addVehicle
);

module.exports = router;
