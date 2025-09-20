// controllers/inventoryController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invController = {};

/**
 * Full inventory list
 */
invController.buildInventory = async function (req, res, next) {
  try {
    const data = await invModel.getInventory();
    const nav = await utilities.getNav();
    res.render("inventory/list", {
      title: "All Vehicles",
      nav,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Inventory by classification
 */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();
    res.render("inventory/classification", {
      title: "Inventory",
      nav,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Vehicle detail
 */
invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId;
    const vehicle = await invModel.getInventoryById(invId);

    if (!vehicle) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      throw err;
    }

    const vehicleHTML = utilities.buildVehicleDetail(vehicle);
    const nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: `${vehicle.inv_make || ""} ${vehicle.inv_model || ""}`.trim(),
      nav,
      vehicleHTML,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = invController;
