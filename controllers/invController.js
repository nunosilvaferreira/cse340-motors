// controllers/invController.js
const invModel = require("../models/inventory-model");
const classificationModel = require("../models/classificationModel");
const vehicleModel = require("../models/vehicleModel");
const utilities = require("../utilities/");

const invController = {};

/**
 * Full inventory list
 */
invController.buildInventory = async function (req, res, next) {
  try {
    console.log("Building inventory page...");
    
    const data = await invModel.getInventory();
    const nav = await utilities.getNav();
    
    console.log("Inventory data retrieved:", data ? data.length : 0, "items");
    
    // Make sure utilities are available to the view
    res.locals.utilities = utilities;
    
    res.render("inventory/list", {
      title: "All Vehicles",
      nav,
      data,
    });
  } catch (err) {
    console.error("Error in buildInventory:", err);
    next(err);
  }
};

/**
 * Inventory by classification
 */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    console.log(`Building classification page for ID: ${classification_id}`);
    
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();
    
    console.log(`Inventory for classification ${classification_id}:`, data ? data.length : 0, "items");
    
    // Get classification name for title
    const classifications = await classificationModel.getAllClassifications();
    const classification = classifications.find(c => c.classification_id == classification_id);
    const title = classification ? `${classification.classification_name} Vehicles` : "Inventory";
    
    // Make sure utilities are available to the view
    res.locals.utilities = utilities;
    
    res.render("inventory/classification", {
      title: title,
      nav,
      data,
      classification_name: classification ? classification.classification_name : "Unknown",
    });
  } catch (err) {
    console.error("Error in buildByClassificationId:", err);
    next(err);
  }
};

/**
 * Vehicle detail
 */
invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId;
    console.log(`Building vehicle detail for ID: ${invId}`);
    
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
    console.error("Error in buildVehicleDetail:", err);
    next(err);
  }
};

/* =========================
   W04 Additions
   ========================= */

/**
 * Management page
 */
invController.buildManagement = async function (req, res, next) {
  try {
    const classifications = await classificationModel.getAllClassifications();
    const nav = await utilities.getNav();
    const messages = req.flash();
    
    console.log("Classifications for management:", classifications);

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications,
      messages,
    });
  } catch (err) {
    console.error("Error in buildManagement:", err);
    next(err);
  }
};

/**
 * Add classification (POST)
 */
invController.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    await classificationModel.insertClassification(classification_name);

    req.flash("success", "Classification added successfully.");
    res.redirect("/inventory/management");
  } catch (err) {
    console.error("Error in addClassification:", err);
    req.flash("error", err.message || "Error adding classification.");
    res.redirect("/inventory/management");
  }
};

/**
 * Show add vehicle form
 */
invController.buildAddVehicle = async function (req, res, next) {
  try {
    const classifications = await classificationModel.getAllClassifications();
    const nav = await utilities.getNav();
    const messages = req.flash();

    res.render("inventory/addVehicle", {
      title: "Add Vehicle",
      nav,
      classifications,
      messages,
    });
  } catch (err) {
    console.error("Error in buildAddVehicle:", err);
    next(err);
  }
};

/**
 * Add vehicle (POST)
 */
invController.addVehicle = async function (req, res, next) {
  try {
    const {
      classification_id,
      make,
      model,
      year,
      description,
      price,
      miles,
      color,
      image,
      thumbnail,
    } = req.body;

    await vehicleModel.insertVehicle({
      classification_id,
      make,
      model,
      year,
      description,
      price,
      miles,
      color,
      image,
      thumbnail,
    });

    req.flash("success", "Vehicle added successfully.");
    res.redirect("/inventory/management");
  } catch (err) {
    console.error("Error in addVehicle:", err);
    req.flash("error", err.message || "Error adding vehicle.");
    res.redirect("/inventory/vehicle/add");
  }
};

/* =========================
   W05 Additions
   ========================= */

/**
 * Build edit vehicle form
 */
invController.buildEditVehicle = async function (req, res, next) {
  try {
    const invId = req.params.invId;
    const vehicle = await invModel.getInventoryById(invId);
    const classifications = await classificationModel.getAllClassifications();
    const nav = await utilities.getNav();
    const messages = req.flash();

    res.render("inventory/editVehicle", {
      title: "Edit Vehicle",
      nav,
      classifications,
      vehicle,
      messages,
    });
  } catch (err) {
    console.error("Error in buildEditVehicle:", err);
    next(err);
  }
};

/**
 * Update vehicle (POST)
 */
invController.updateVehicle = async function (req, res, next) {
  try {
    const { inv_id, classification_id, make, model, year, description, price, miles, color, image, thumbnail } = req.body;
    
    const sql = `
      UPDATE inventory
      SET classification_id=$1, inv_make=$2, inv_model=$3, inv_year=$4, inv_description=$5,
          inv_price=$6, inv_miles=$7, inv_color=$8, inv_image=$9, inv_thumbnail=$10
      WHERE inv_id=$11
    `;
    
    await require("../database/db").query(sql, [
      classification_id, make, model, year, description, 
      price, miles, color, image, thumbnail, inv_id
    ]);

    req.flash("success", "Vehicle updated successfully.");
    res.redirect("/inventory/management");
  } catch (err) {
    console.error("Error in updateVehicle:", err);
    req.flash("error", "Error updating vehicle.");
    res.redirect(`/inventory/edit/${req.body.inv_id}`);
  }
};

/**
 * Get inventory as JSON for AJAX
 */
invController.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    
    if (invData && invData.length > 0) {
      return res.json(invData);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.error("Error in getInventoryJSON:", error);
    next(new Error("No data returned"));
  }
};

module.exports = invController;