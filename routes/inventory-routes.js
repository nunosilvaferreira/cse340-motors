// routes/inventory-routes.js
const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/invController")
const validation = require("../utilities/validationMiddleware")
const utilities = require("../utilities/")

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
// W04 additions
// ========================

// Inventory management page (🔒 protected)
router.get(
  "/management",
  utilities.checkJWT,
  utilities.handleErrors(inventoryController.buildManagement)
)

// Process new classification (🔒 protected)
router.post(
  "/classification/add",
  utilities.checkJWT,
  validation.validateClassification,
  utilities.handleErrors(inventoryController.addClassification)
)

// Show add-vehicle form (🔒 protected)
router.get(
  "/vehicle/add",
  utilities.checkJWT,
  utilities.handleErrors(inventoryController.buildAddVehicle)
)

// Process new vehicle (🔒 protected)
router.post(
  "/vehicle/add",
  utilities.checkJWT,
  validation.validateVehicle,
  utilities.handleErrors(inventoryController.addVehicle)
)

// ========================
// W05 additions
// ========================

// Edit vehicle (🔒 protected)
router.get(
  "/edit/:invId",
  utilities.checkJWT,
  utilities.handleErrors(inventoryController.buildEditVehicle)
)

router.post(
  "/update",
  utilities.checkJWT,
  utilities.handleErrors(inventoryController.updateVehicle)
)

module.exports = router
