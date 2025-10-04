// routes/inventory-routes.js
const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/invController")
const validation = require("../utilities/validationMiddleware")
const utilities = require("../utilities/")

// ========================
// Public Routes
// ========================

// Inventory by classification
router.get(
  "/classification/:classificationId",
  utilities.handleErrors(inventoryController.buildByClassificationId)
)

// Vehicle detail
router.get(
  "/detail/:invId",
  utilities.handleErrors(inventoryController.buildVehicleDetail)
)

// Full inventory list
router.get(
  "/inventory",
  utilities.handleErrors(inventoryController.buildInventory)
)

// Error test
router.get("/error", (req, res, next) => {
  next(new Error("Intentional 500 error for testing (footer link)"))
})

// ========================
// Protected Routes - Employee/Admin Only
// ========================

// Inventory management page (🔒 protected - Employees and Admins only)
router.get(
  "/management",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  utilities.handleErrors(inventoryController.buildManagement)
)

// Process new classification (🔒 protected - Employees and Admins only)
router.post(
  "/classification/add",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  validation.validateClassification,
  utilities.handleErrors(inventoryController.addClassification)
)

// Show add-vehicle form (🔒 protected - Employees and Admins only)
router.get(
  "/vehicle/add",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  utilities.handleErrors(inventoryController.buildAddVehicle)
)

// Process new vehicle (🔒 protected - Employees and Admins only)
router.post(
  "/vehicle/add",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  validation.validateVehicle,
  utilities.handleErrors(inventoryController.addVehicle)
)

// ========================
// W05 additions - Protected Routes
// ========================

// Edit vehicle form (🔒 protected - Employees and Admins only)
router.get(
  "/edit/:invId",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  utilities.handleErrors(inventoryController.buildEditVehicle)
)

// Update vehicle (🔒 protected - Employees and Admins only)
router.post(
  "/update",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  utilities.handleErrors(inventoryController.updateVehicle)
)

// ========================
// W05 Delete Routes - Protected
// ========================

// Delete confirmation view (🔒 protected - Employees and Admins only)
router.get(
  "/delete/:invId",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  utilities.handleErrors(inventoryController.buildDeleteConfirm)
)

// Process vehicle deletion (🔒 protected - Employees and Admins only)
router.post(
  "/delete",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  utilities.handleErrors(inventoryController.deleteVehicle)
)

// ========================
// JSON/AJAX Routes - Protected
// ========================

// Get inventory by classification as JSON (🔒 protected - Employees and Admins only)
router.get(
  "/getInventory/:classification_id",
  utilities.checkJWT,
  utilities.checkAccountType("Employee"),
  utilities.handleErrors(inventoryController.getInventoryJSON)
)

module.exports = router
