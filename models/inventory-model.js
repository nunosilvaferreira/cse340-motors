// models/inventory-model.js
const pool = require("../database/db");

const inventoryModel = {};

/**
 * Get all inventory items
 */
inventoryModel.getInventory = async function () {
  try {
    const sql = `SELECT * FROM inventory ORDER BY inv_make, inv_model`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("Inventory model error:", error);
    throw error;
  }
};

/**
 * Get inventory items by classification ID
 */
inventoryModel.getInventoryByClassificationId = async function (
  classification_id
) {
  try {
    const sql = `SELECT * FROM inventory WHERE classification_id = $1 ORDER BY inv_make, inv_model`;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error("Inventory model error by classification:", error);
    throw error;
  }
};

/**
 * Get all classifications
 */
inventoryModel.getClassifications = async function () {
  try {
    const sql = `SELECT classification_id, classification_name FROM classification ORDER BY classification_name`;
    const result = await pool.query(sql);
    return result;
  } catch (error) {
    console.error("Inventory model error (getClassifications):", error);
    throw error;
  }
};

/**
 * Get inventory item by ID
 */
inventoryModel.getInventoryById = async function (inv_id) {
  try {
    const sql = `SELECT * FROM inventory WHERE inv_id = $1`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Inventory model error (getInventoryById):", error);
    throw error;
  }
};

module.exports = inventoryModel;
