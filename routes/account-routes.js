// routes/account-routes.js
const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const validation = require("../utilities/validationMiddleware")

// Views
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.checkJWT, utilities.handleErrors(accountController.buildAccountManagement))
router.get("/update", utilities.checkJWT, utilities.handleErrors(accountController.buildAccountUpdate))

// Actions
router.post("/register", 
  validation.validateRegistration(),
  utilities.handleErrors(accountController.registerAccount)
)

router.post("/login", 
  utilities.handleErrors(accountController.accountLogin)
)

router.post("/update", 
  utilities.checkJWT,
  validation.validateAccountUpdate(),
  utilities.handleErrors(accountController.updateAccount)
)

router.post("/update-password", 
  utilities.checkJWT,
  validation.validatePassword(),
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", accountController.logout)

module.exports = router