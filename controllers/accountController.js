// controllers/accountController.js
const accountModel = require("../models/accountModel")
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
 * Deliver login view
 **************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Deliver register view
 **************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Process registration
 **************************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let nav = await utilities.getNav()

  const hashedPassword = await bcrypt.hash(account_password, 10)

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
    if (regResult) {
      req.flash("notice", "Registration successful. Please log in.")
      res.status(201).redirect("/account/login")
    } else {
      req.flash("notice", "Registration failed. Please try again.")
      res.status(501).render("account/register", { title: "Register", nav, errors: null })
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Registration error. Try again.")
    res.status(500).render("account/register", { title: "Register", nav, errors: null })
  }
}

/* ****************************************
 * Process login
 **************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  
  try {
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null, 
        account_email 
      })
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    
    if (passwordMatch) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600000 })
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Invalid credentials.")
      res.status(400).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null, 
        account_email 
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "Login error. Please try again.")
    res.status(500).render("account/login", { 
      title: "Login", 
      nav, 
      errors: null 
    })
  }
}

/* ****************************************
 * Deliver account management view
 **************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  
  let greeting = ""
  let managementLink = ""
  
  if (accountData.account_type === "Client") {
    greeting = `<h2>Welcome ${accountData.account_firstname}</h2>`
  } else if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
    greeting = `<h2>Welcome ${accountData.account_firstname}</h2>
                <h3>Inventory Management</h3>
                <p><a href="/inventory/management">Manage Inventory</a></p>`
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    greeting,
    managementLink,
    accountData
  })
}

/* ****************************************
 * Deliver account update view
 **************************************** */
async function buildAccountUpdate(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id
  })
}

/* ****************************************
 * Process account update
 **************************************** */
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let nav = await utilities.getNav()

  try {
    // Check if email already exists (excluding current account)
    const emailExists = await accountModel.checkEmailExists(account_email, account_id)
    if (emailExists) {
      req.flash("notice", "Email already exists. Please use a different email.")
      return res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }

    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      // Update JWT token with new account data
      const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600000 })
      }

      req.flash("notice", "Account updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Account update failed.")
      res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }
  } catch (error) {
    console.error("Update account error:", error)
    req.flash("notice", "Account update error.")
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/* ****************************************
 * Process password update
 **************************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  let nav = await utilities.getNav()

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Password update failed.")
      res.redirect("/account/update")
    }
  } catch (error) {
    console.error("Update password error:", error)
    req.flash("notice", "Password update error.")
    res.redirect("/account/update")
  }
}

/* ****************************************
 * Logout
 **************************************** */
function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildAccountUpdate,
  updateAccount,
  updatePassword,
  logout,
}