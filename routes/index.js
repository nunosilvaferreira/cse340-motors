const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');

// Home page route
router.get('/', function(req, res) {
  res.render('index', { title: 'CSE Motors Home' });
});

// Inventory routes - Learning Activity 1
router.get('/inv', invController.buildInventory);
router.get('/inv/classification/:classificationId', invController.buildByClassificationId);

module.exports = router;