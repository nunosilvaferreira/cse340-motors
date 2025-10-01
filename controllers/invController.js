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
    const messages = req.session.messages || [];
    const formData = req.session.formData || {};
    delete req.session.messages;
    delete req.session.formData;

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classifications,
      messages,
      formData,
    });
  } catch (err) {
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

    req.session.messages = [
      { type: "success", text: "Classification added successfully." },
    ];
    res.redirect("/inventory/management");
  } catch (err) {
    req.session.formData = { classification_name: req.body.classification_name };
    req.session.messages = [
      { type: "error", text: err.message || "Error adding classification." },
    ];
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
    const messages = req.session.messages || [];
    const formData = req.session.formData || {};
    delete req.session.messages;
    delete req.session.formData;

    res.render("inventory/addVehicle", {
      title: "Add Vehicle",
      nav,
      classifications,
      messages,
      formData,
    });
  } catch (err) {
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

    req.session.messages = [
      { type: "success", text: "Vehicle added successfully." },
    ];
    res.redirect("/inventory/management");
  } catch (err) {
    req.session.formData = { ...req.body };
    req.session.messages = [
      { type: "error", text: err.message || "Error adding vehicle." },
    ];
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
    const invId = req.params.invId
    const vehicle = await invModel.getInventoryById(invId)
    const classifications = await classificationModel.getAllClassifications()
    const nav = await utilities.getNav()

    res.render("inventory/editVehicle", {
      title: "Edit Vehicle",
      nav,
      classifications,
      vehicle,
      messages: [],
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Update vehicle (POST)
 */
invController.updateVehicle = async function (req, res, next) {
  try {
    const { inv_id, classification_id, make, model, year, description, price, miles, color, image, thumbnail } = req.body
    const sql = `
      UPDATE inventory
      SET classification_id=$1, inv_make=$2, inv_model=$3, inv_year=$4, inv_description=$5,
          inv_price=$6, inv_miles=$7, inv_color=$8, inv_image=$9, inv_thumbnail=$10
      WHERE inv_id=$11
    `
    await require("../database/db").query(sql, [classification_id, make, model, year, description, price, miles, color, image, thumbnail, inv_id])

    req.session.messages = [{ type: "success", text: "Vehicle updated successfully." }]
    res.redirect("/inventory/management")
  } catch (err) {
    req.session.messages = [{ type: "error", text: "Error updating vehicle." }]
    res.redirect(`/inventory/edit/${req.body.inv_id}`)
  }
}

module.exports = invController;
