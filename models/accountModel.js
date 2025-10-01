// models/accountModel.js
const pool = require("../database/db")

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

module.exports = { registerAccount, getAccountByEmail }
