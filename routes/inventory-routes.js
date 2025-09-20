// routes/inventory-routes.js
const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// all inventory
router.get("/", invController.buildInventory);

// inventory by classification
router.get("/classification/:classificationId", invController.buildByClassificationId);

// vehicle detail
router.get("/detail/:invId", invController.buildVehicleDetail);

// intentional 500 error for testing
router.get("/cause-error", (req, res, next) => {
  const err = new Error("Intentional server error for testing");
  err.status = 500;
  next(err);
});

module.exports = router;
