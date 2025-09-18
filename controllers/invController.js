// controllers/inventoryController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/**
 * Build the inventory by classification view
 */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()
    res.render("inventory/classification", {
      title: "Vehicle Inventory",
      nav,
      data
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Build the full inventory view
 */
invController.buildInventory = async function (req, res, next) {
  try {
    const data = await invModel.getInventory()
    const nav = await utilities.getNav()
    res.render("inventory/list", {
      title: "All Vehicles",
      nav,
      data
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invController
