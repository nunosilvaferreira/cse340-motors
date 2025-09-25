// models/vehicleModel.js
const pool = require("../database/db");

const vehicleModel = {};

/**
 * Insert a new vehicle (full schema)
 */
vehicleModel.insertVehicle = async function ({
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
}) {
  try {
    const sql = `
      INSERT INTO inventory 
        (classification_id, inv_make, inv_model, inv_year, inv_description, 
         inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,
              COALESCE($6, '/images/vehicle-default.jpg'),
              COALESCE($7, '/images/vehicle-default-tn.jpg'),
              $8,$9,$10)
      RETURNING inv_id
    `;
    const values = [
      classification_id,
      make,
      model,
      year,
      description,
      image,
      thumbnail,
      price,
      miles,
      color,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("vehicleModel error (insertVehicle):", error);
    throw error;
  }
};

module.exports = vehicleModel;
