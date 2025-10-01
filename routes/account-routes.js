// routes/account-routes.js
const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Views
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.checkJWT, utilities.handleErrors(accountController.buildAccountManagement))

// Actions
router.post("/register", utilities.handleErrors(accountController.registerAccount))
router.post("/login", utilities.handleErrors(accountController.accountLogin))
router.get("/logout", accountController.logout)

module.exports = router
