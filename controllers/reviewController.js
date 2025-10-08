const reviewModel = require('../models/reviewModel');

const reviewController = {};

/**
 * Handle a new review submission
 */
reviewController.addReview = async function (req, res, next) {
  try {
    const { inv_id, reviewer_name, review_text, rating } = req.body;

    // Basic validation
    if (!inv_id || !reviewer_name || !review_text || !rating) {
      req.flash('error', 'All fields are required.');
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    await reviewModel.insertReview({
      inv_id: Number(inv_id),
      reviewer_name: reviewer_name.trim(),
      review_text: review_text.trim(),
      rating: Number(rating)
    });

    req.flash('success', 'Your review has been posted.');
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error('reviewController.addReview error:', error);
    req.flash('error', 'Could not post review. Please try again later.');
    res.redirect(`/inv/detail/${req.body.inv_id || ''}`);
  }
};

module.exports = reviewController;
