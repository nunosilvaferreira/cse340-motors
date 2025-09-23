// routes/inventory-routes.js

const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/invController");

// Inventory by classification
router.get(
  "/classification/:classificationId",
  inventoryController.buildByClassificationId
);

// Vehicle detail
router.get("/detail/:invId", inventoryController.buildVehicleDetail);

// Full inventory list (optional, if you want a route for all vehicles)
router.get("/inventory", inventoryController.buildInventory);

// New error route for testing 500
router.get("/error", (req, res, next) => {
  next(new Error("Intentional 500 error for testing (footer link)"));
});

module.exports = router;
