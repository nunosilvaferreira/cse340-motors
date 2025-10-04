// utilities/validationMiddleware.js
const accountModel = require("../models/accountModel")

// Validation rules for classification
exports.validateClassification = (req, res, next) => {
  const { classification_name } = req.body;
  if (!classification_name || classification_name.trim().length < 2) {
    return next(new Error("Classification name must be at least 2 characters."));
  }
  next();
};

// Validation rules for vehicle
exports.validateVehicle = (req, res, next) => {
  const { classification_id, make, model, year, description, price, miles, color } = req.body;

  if (!classification_id) {
    return next(new Error("Classification is required."));
  }
  if (!make || make.trim().length < 1) {
    return next(new Error("Make is required."));
  }
  if (!model || model.trim().length < 1) {
    return next(new Error("Model is required."));
  }
  if (!year || isNaN(Number(year))) {
    return next(new Error("Year must be a number."));
  }
  if (!description || description.trim().length < 10) {
    return next(new Error("Description is required (min 10 chars)."));
  }
  if (!price || isNaN(Number(price))) {
    return next(new Error("Price must be a number."));
  }
  if (!miles || isNaN(Number(miles))) {
    return next(new Error("Miles must be a number."));
  }
  if (!color || color.trim().length < 1) {
    return next(new Error("Color is required."));
  }

  next();
};

// Validation for registration
exports.validateRegistration = () => {
  return (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    
    if (!account_firstname || account_firstname.trim().length < 1) {
      return next(new Error("First name is required."));
    }
    if (!account_lastname || account_lastname.trim().length < 1) {
      return next(new Error("Last name is required."));
    }
    if (!account_email || !isValidEmail(account_email)) {
      return next(new Error("Valid email is required."));
    }
    if (!account_password || account_password.length < 6) {
      return next(new Error("Password must be at least 6 characters."));
    }
    
    next();
  };
};

// Validation for account update
exports.validateAccountUpdate = () => {
  return async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    
    if (!account_firstname || account_firstname.trim().length < 1) {
      return next(new Error("First name is required."));
    }
    if (!account_lastname || account_lastname.trim().length < 1) {
      return next(new Error("Last name is required."));
    }
    if (!account_email || !isValidEmail(account_email)) {
      return next(new Error("Valid email is required."));
    }
    
    next();
  };
};

// Validation for password
exports.validatePassword = () => {
  return (req, res, next) => {
    const { account_password } = req.body;
    
    if (!account_password || account_password.length < 6) {
      return next(new Error("Password must be at least 6 characters."));
    }
    
    next();
  };
};

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}