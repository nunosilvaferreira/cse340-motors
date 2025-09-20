// routes/inventory-routes.js
const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")

// Route for all inventory
router.get("/", invController.buildInventory)

// Route for inventory by classification
router.get("/classification/:classificationId", invController.buildByClassificationId)

module.exports = router
