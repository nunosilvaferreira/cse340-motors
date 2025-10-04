// models/accountModel.js
const pool = require("../database/db")
const bcrypt = require("bcryptjs")

/* Register new account */
async function registerAccount(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
      VALUES ($1, $2, $3, $4)
      RETURNING account_id
    `
    const result = await pool.query(sql, [firstname, lastname, email, password])
    return result.rows[0]
  } catch (error) {
    console.error("accountModel.registerAccount error:", error)
    throw error
  }
}

/* Get account by email */
async function getAccountByEmail(email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [email])
    return result.rows[0]
  } catch (error) {
    console.error("accountModel.getAccountByEmail error:", error)
    throw error
  }
}

/* Get account by ID */
async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("accountModel.getAccountById error:", error)
    throw error
  }
}

/* Update account information */
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account 
      SET account_firstname = $1, account_lastname = $2, account_email = $3
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [firstname, lastname, email, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("accountModel.updateAccount error:", error)
    throw error
  }
}

/* Update password */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account 
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("accountModel.updatePassword error:", error)
    throw error
  }
}

/* Check if email exists (excluding current account) */
async function checkEmailExists(email, exclude_account_id = null) {
  try {
    let sql = "SELECT account_id FROM account WHERE account_email = $1"
    let params = [email]
    
    if (exclude_account_id) {
      sql += " AND account_id != $2"
      params.push(exclude_account_id)
    }
    
    const result = await pool.query(sql, params)
    return result.rows.length > 0
  } catch (error) {
    console.error("accountModel.checkEmailExists error:", error)
    throw error
  }
}

module.exports = { 
  registerAccount, 
  getAccountByEmail, 
  getAccountById,
  updateAccount,
  updatePassword,
  checkEmailExists
}