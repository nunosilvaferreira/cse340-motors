// controllers/reviewController.js
const reviewModel = require('../models/reviewModel');

const reviewController = {};

/**
 * Handle a new review submission
 * Server-side validation should already have run via validation middleware.
 */
reviewController.addReview = async function (req, res, next) {
  try {
    const { inv_id, reviewer_name, review_text, rating } = req.body;

    // Defensive check: if middleware missed something, still check and return cleanly
    if (!inv_id || !reviewer_name || !review_text || rating === undefined) {
      req.flash('error', 'All fields are required.');
      return res.redirect(`/inv/detail/${inv_id || ''}`);
    }

    // Attempt insert
    try {
      await reviewModel.insertReview({
        inv_id: Number(inv_id),
        reviewer_name: reviewer_name.trim(),
        review_text: review_text.trim(),
        rating: Number(rating)
      });

      req.flash('success', 'Your review has been posted.');
      return res.redirect(`/inv/detail/${inv_id}`);
    } catch (dbError) {
      // Database insert failed (could be missing table etc.)
      console.error('reviewController.addReview DB error:', dbError);
      req.flash('error', 'Could not post review right now. Please try again later.');
      return res.redirect(`/inv/detail/${inv_id}`);
    }

  } catch (error) {
    console.error('reviewController.addReview unexpected error:', error);
    req.flash('error', 'An unexpected error occurred. Please try again later.');
    return res.redirect(`/inv/detail/${req.body.inv_id || ''}`);
  }
};

module.exports = reviewController;
