-- Drop tables if they exist  to avoid conflicts
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS classification;

-- Create classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(100) NOT NULL
);

-- Create account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(100) NOT NULL,
    account_lastname VARCHAR(100) NOT NULL,
    account_email VARCHAR(255) NOT NULL UNIQUE,
    account_password VARCHAR(255) NOT NULL,
    account_type VARCHAR(10) DEFAULT 'Client'
);

-- Create inventory table
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

-- Insert sample classifications
INSERT INTO classification (classification_name) VALUES
('Custom'),
('Sport'),
('SUV'),
('Truck'),
('Sedan');

-- Insert sample vehicles
INSERT INTO inventory (
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
) VALUES
('GM', 'Hummer', 2023, 'A vehicle with a huge interior for ultimate comfort and space.', '/images/gm-hummer.jpg', '/images/gm-hummer-tn.jpg', 45000.00, 15000, 'Black', 4),
('Ford', 'Mustang', 2023, 'A powerful sports car with exceptional performance.', '/images/ford-mustang.jpg', '/images/ford-mustang-tn.jpg', 35000.00, 8000, 'Red', 2),
('Toyota', 'Camry', 2023, 'A reliable sedan with great fuel efficiency.', '/images/toyota-camry.jpg', '/images/toyota-camry-tn.jpg', 28000.00, 12000, 'Blue', 5),
('Jeep', 'Wrangler', 2023, 'An off-road SUV built for adventure.', '/images/jeep-wrangler.jpg', '/images/jeep-wrangler-tn.jpg', 38000.00, 10000, 'Green', 3);

-- Query 4 from Task 1: Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 6 from Task 1: Update image paths
UPDATE inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');