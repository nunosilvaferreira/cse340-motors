// utilities/validationMiddleware.js
const accountModel = require("../models/accountModel")

// Validation rules for classification
exports.validateClassification = (req, res, next) => {
  const { classification_name } = req.body;
  if (!classification_name || classification_name.trim().length < 2) {
    req.flash("error", "Classification name must be at least 2 characters.");
    return res.redirect("/inventory/management");
  }
  next();
};

// Validation rules for vehicle
exports.validateVehicle = (req, res, next) => {
  const { classification_id, make, model, year, description, price, miles, color } = req.body;

  if (!classification_id) {
    req.flash("error", "Classification is required.");
    return res.redirect("/inventory/vehicle/add");
  }
  if (!make || make.trim().length < 1) {
    req.flash("error", "Make is required.");
    return res.redirect("/inventory/vehicle/add");
  }
  if (!model || model.trim().length < 1) {
    req.flash("error", "Model is required.");
    return res.redirect("/inventory/vehicle/add");
  }
  if (!year || isNaN(Number(year))) {
    req.flash("error", "Year must be a number.");
    return res.redirect("/inventory/vehicle/add");
  }
  if (!description || description.trim().length < 10) {
    req.flash("error", "Description is required (min 10 chars).");
    return res.redirect("/inventory/vehicle/add");
  }
  if (!price || isNaN(Number(price))) {
    req.flash("error", "Price must be a number.");
    return res.redirect("/inventory/vehicle/add");
  }
  if (!miles || isNaN(Number(miles))) {
    req.flash("error", "Miles must be a number.");
    return res.redirect("/inventory/vehicle/add");
  }
  if (!color || color.trim().length < 1) {
    req.flash("error", "Color is required.");
    return res.redirect("/inventory/vehicle/add");
  }

  next();
};

// Validation for registration
exports.validateRegistration = () => {
  return (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    
    if (!account_firstname || account_firstname.trim().length < 1) {
      req.flash("error", "First name is required.");
      return res.redirect("/account/register");
    }
    if (!account_lastname || account_lastname.trim().length < 1) {
      req.flash("error", "Last name is required.");
      return res.redirect("/account/register");
    }
    if (!account_email || !isValidEmail(account_email)) {
      req.flash("error", "Valid email is required.");
      return res.redirect("/account/register");
    }
    if (!account_password || account_password.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect("/account/register");
    }
    
    next();
  };
};

// Validation for account update
exports.validateAccountUpdate = () => {
  return async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    
    if (!account_firstname || account_firstname.trim().length < 1) {
      req.flash("error", "First name is required.");
      return res.redirect("/account/update");
    }
    if (!account_lastname || account_lastname.trim().length < 1) {
      req.flash("error", "Last name is required.");
      return res.redirect("/account/update");
    }
    if (!account_email || !isValidEmail(account_email)) {
      req.flash("error", "Valid email is required.");
      return res.redirect("/account/update");
    }
    
    next();
  };
};

// Validation for password
exports.validatePassword = () => {
  return (req, res, next) => {
    const { account_password } = req.body;
    
    if (!account_password || account_password.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect("/account/update");
    }
    
    next();
  };
};

// Validation for review (server-side)
exports.validateReview = (req, res, next) => {
  const { inv_id, reviewer_name, review_text, rating } = req.body;

  // inv_id must exist and be a number
  if (!inv_id || isNaN(Number(inv_id))) {
    req.flash("error", "Invalid vehicle identifier.");
    return res.redirect(`/inv/inventory`);
  }

  // reviewer_name at least 2 chars
  if (!reviewer_name || reviewer_name.trim().length < 2) {
    req.flash("error", "Reviewer name must be at least 2 characters.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  // review_text at least 5 chars
  if (!review_text || review_text.trim().length < 5) {
    req.flash("error", "Review text must be at least 5 characters.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  // rating integer 1..5
  const r = Number(rating);
  if (rating === undefined || rating === null || isNaN(r) || r < 1 || r > 5) {
    req.flash("error", "Rating must be an integer between 1 and 5.");
    return res.redirect(`/inv/detail/${inv_id}`);
  }

  // If all good, continue
  next();
};

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
