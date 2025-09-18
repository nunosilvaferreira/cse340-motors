const pool = require('../database/db');

const inventoryModel = {};

/**
 * Get all inventory items
 * @returns {Promise<Array>} Array of inventory items
 */
inventoryModel.getInventory = async function() {
  try {
    const sql = `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_description 
                 FROM inventory 
                 ORDER BY inv_make, inv_model`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error('Inventory model error:', error);
    throw error;
  }
};

/**
 * Get inventory items by classification ID
 * @param {number} classification_id - The classification ID
 * @returns {Promise<Array>} Array of inventory items for the classification
 */
inventoryModel.getInventoryByClassificationId = async function(classification_id) {
  try {
    const sql = `SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_description 
                 FROM inventory 
                 WHERE classification_id = $1 
                 ORDER BY inv_make, inv_model`;
    const result = await pool.query(sql, [classification_id]);
    return result.rows;
  } catch (error) {
    console.error('Inventory model error by classification:', error);
    throw error;
  }
};

/**
 * Get all classifications
 * @returns {Promise<Array>} Array of classification rows
 */
inventoryModel.getClassifications = async function() {
  try {
    const sql = `SELECT classification_id, classification_name
                 FROM classification
                 ORDER BY classification_name`;
    const result = await pool.query(sql);
    return result; // devolve o objeto pg, que tem .rows
  } catch (error) {
    console.error('Inventory model error (getClassifications):', error);
    throw error;
  }
};


module.exports = inventoryModel;