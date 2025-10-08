const pool = require('../database/db');

const reviewModel = {};

/**
 * Insert a new review into the database
 */
reviewModel.insertReview = async function ({ inv_id, reviewer_name, review_text, rating }) {
  try {
    const sql = `
      INSERT INTO review (inv_id, reviewer_name, review_text, rating)
      VALUES ($1, $2, $3, $4)
      RETURNING review_id, review_date
    `;
    const values = [inv_id, reviewer_name, review_text, rating];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("reviewModel.insertReview error:", error);
    throw error;
  }
};

/**
 * Get all reviews for a specific vehicle (inv_id), ordered by newest first
 */
reviewModel.getReviewsByInvId = async function (inv_id) {
  try {
    const sql = `
      SELECT review_id, inv_id, reviewer_name, review_text, rating, review_date
      FROM review
      WHERE inv_id = $1
      ORDER BY review_date DESC
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("reviewModel.getReviewsByInvId error:", error);
    throw error;
  }
};

module.exports = reviewModel;
