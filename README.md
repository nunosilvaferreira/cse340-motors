📘 W04 – Inventory Management Features
Overview

In Week 04, the project was extended with full Inventory Management functionality.
The new features allow administrators to:

Add new vehicle classifications.

Add new vehicles with all required details.

Use server-side validation to ensure data integrity.

Display flash messages for success or error.

Maintain sticky form values when validation fails.

🔧 New Files

Models

models/classificationModel.js

models/vehicleModel.js

Utilities

utilities/validationMiddleware.js

Views

views/inventory/management.ejs

views/inventory/addVehicle.ejs

✏️ Updated Files

Routes

routes/inventory-routes.js

Added routes for management, classification creation, and vehicle creation.

Controllers

controllers/invController.js

Added buildManagement, addClassification, buildAddVehicle, and addVehicle methods.

🗂️ Database Schema

The following tables were used (already defined in create-tables.sql):

classification

CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(100) NOT NULL
);


inventory

CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(100) NOT NULL,
    inv_model VARCHAR(100) NOT NULL,
    inv_year INTEGER NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255) NOT NULL DEFAULT '/images/vehicle-default.jpg',
    inv_thumbnail VARCHAR(255) NOT NULL DEFAULT '/images/vehicle-default-tn.jpg',
    inv_price DECIMAL(10,2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(50) NOT NULL,
    classification_id INTEGER REFERENCES classification(classification_id)
);

🚀 New Routes
Route	Method	Description
/inventory/management	GET	Show management page (classifications + add form).
/inventory/classification/add	POST	Add new classification (validated, duplicate check).
/inventory/vehicle/add	GET	Show add vehicle form.
/inventory/vehicle/add	POST	Insert a new vehicle (validated, sticky form on error).
✅ Validation

Implemented in utilities/validationMiddleware.js:

Classification

Name must be at least 2 characters.

Vehicle

All required fields validated (make, model, year, description, price, miles, color).

Year, price, and miles must be numbers.

Description requires at least 10 characters.

💡 User Experience

Forms retain values after validation errors (sticky inputs).

Success and error messages displayed on each page.

Default images used if no custom image/thumbnail is provided.

🖥️ Testing

Navigate to /inventory/management.

View existing classifications.

Add a new classification (error if duplicate).

Navigate to /inventory/vehicle/add.

Add a new vehicle with all required details.

Test validation by leaving fields blank or invalid.

On success, vehicle is stored in DB and visible in classification listings.

🎯 Deliverables

Server-side validation implemented.

Sticky inputs working.

Flash messages working.

New database records created successfully.

This ensures the project meets all W04 requirements.