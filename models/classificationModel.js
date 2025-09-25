// models/classificationModel.js
const pool = require("../database/db");

const classificationModel = {};

/**
 * Get all classifications
 */
classificationModel.getAllClassifications = async function () {
  try {
    const sql = `SELECT classification_id, classification_name 
                 FROM classification 
                 ORDER BY classification_name`;
    const result = await pool.query(sql);
    return result.rows;
  } catch (error) {
    console.error("classificationModel error (getAllClassifications):", error);
    throw error;
  }
};

/**
 * Insert a new classification (prevents duplicates)
 */
classificationModel.insertClassification = async function (classification_name) {
  try {
    // Check duplicates
    const checkSql = `SELECT classification_id 
                      FROM classification 
                      WHERE classification_name = $1`;
    const check = await pool.query(checkSql, [classification_name]);
    if (check.rowCount > 0) {
      throw new Error("Classification already exists.");
    }

    const insertSql = `INSERT INTO classification (classification_name) 
                       VALUES ($1) 
                       RETURNING classification_id`;
    const result = await pool.query(insertSql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("classificationModel error (insertClassification):", error);
    throw error;
  }
};

module.exports = classificationModel;
