const inventoryModel = require('../models/inventory-model');

const invController = {};

/**
 * Build inventory view
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
invController.buildInventory = async function(req, res, next) {
  try {
    const data = await inventoryModel.getInventory();
    res.render('pages/inventory', {
      title: 'Vehicle Inventory',
      vehicles: data,
      nav: await utilities.getNav() // Assuming you have a utilities function for navigation
    });
  } catch (error) {
    console.error('Inventory controller error:', error);
    next(error);
  }
};

/**
 * Build inventory by classification view
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
invController.buildByClassificationId = async function(req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId);
    const data = await inventoryModel.getInventoryByClassificationId(classification_id);
    const classificationName = data.length > 0 ? data[0].classification_name : 'Vehicles';
    
    res.render('pages/inventory', {
      title: `${classificationName} Inventory`,
      vehicles: data,
      nav: await utilities.getNav()
    });
  } catch (error) {
    console.error('Inventory by classification controller error:', error);
    next(error);
  }
};

module.exports = invController;