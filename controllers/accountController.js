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
  const messages = req.flash()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    messages
  })
}

/* ****************************************
 * Deliver register view
 **************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  const messages = req.flash()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages
  })
}

/* ****************************************
 * Process registration
 **************************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let nav = await utilities.getNav()

  try {
    // Check if email already exists
    const existingAccount = await accountModel.getAccountByEmail(account_email)
    if (existingAccount) {
      req.flash("error", "Email already exists. Please use a different email.")
      return res.status(400).render("account/register", { 
        title: "Register", 
        nav, 
        errors: null,
        messages: req.flash()
      })
    }

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
    
    if (regResult) {
      req.flash("success", "Registration successful. Please log in.")
      return res.status(201).redirect("/account/login")
    } else {
      req.flash("error", "Registration failed. Please try again.")
      return res.status(501).render("account/register", { 
        title: "Register", 
        nav, 
        errors: null,
        messages: req.flash()
      })
    }
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("error", "Registration error. Please try again.")
    return res.status(500).render("account/register", { 
      title: "Register", 
      nav, 
      errors: null,
      messages: req.flash()
    })
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
      req.flash("error", "Please check your credentials and try again.")
      return res.status(400).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null, 
        account_email,
        messages: req.flash()
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

      req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
      return res.redirect("/account/")
    } else {
      req.flash("error", "Invalid credentials.")
      return res.status(400).render("account/login", { 
        title: "Login", 
        nav, 
        errors: null, 
        account_email,
        messages: req.flash()
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("error", "Login error. Please try again.")
    return res.status(500).render("account/login", { 
      title: "Login", 
      nav, 
      errors: null,
      messages: req.flash()
    })
  }
}

/* ****************************************
 * Deliver account management view
 **************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  const messages = req.flash()
  
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
    accountData,
    messages
  })
}

/* ****************************************
 * Deliver account update view
 **************************************** */
async function buildAccountUpdate(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  const messages = req.flash()

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
    messages
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
      req.flash("error", "Email already exists. Please use a different email.")
      return res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        messages: req.flash()
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

      req.flash("success", "Account updated successfully.")
      return res.redirect("/account/")
    } else {
      req.flash("error", "Account update failed.")
      return res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        messages: req.flash()
      })
    }
  } catch (error) {
    console.error("Update account error:", error)
    req.flash("error", "Account update error.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      messages: req.flash()
    })
  }
}

/* ****************************************
 * Process password update
 **************************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("success", "Password updated successfully.")
      return res.redirect("/account/")
    } else {
      req.flash("error", "Password update failed.")
      return res.redirect("/account/update")
    }
  } catch (error) {
    console.error("Update password error:", error)
    req.flash("error", "Password update error.")
    return res.redirect("/account/update")
  }
}

/* ****************************************
 * Logout
 **************************************** */
function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("success", "You have been logged out.")
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