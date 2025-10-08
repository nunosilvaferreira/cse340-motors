const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const validation = require('../utilities/validationMiddleware');

// Public route to add a review
router.post('/add', validation.validateReview, reviewController.addReview);

module.exports = router;
