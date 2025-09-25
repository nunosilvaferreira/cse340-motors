// utilities/validationMiddleware.js
exports.validateClassification = (req, res, next) => {
  const { classification_name } = req.body;
  if (!classification_name || classification_name.trim().length < 2) {
    return next(new Error("Classification name must be at least 2 characters."));
  }
  next();
};

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
