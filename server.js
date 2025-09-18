const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const pool = require('./database/db'); // Database connection
const utilities = require('./utilities/'); // Utilities module

// Initialize express app first
const app = express();

// Middleware
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// Set up static assets directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Import routes
const indexRouter = require('./routes/index');
const inventoryRoute = require("./routes/inventory-routes")

// Use routes
app.use('/', indexRouter);
app.use('/inv', inventoryRouter);

// Error handling middleware (Learning Activity 3)
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  if (err.status == 404) {
    res.status(404).render("errors/404", {
      title: "404 - Page Not Found",
      message: err.message,
      nav
    });
  } else {
    res.status(500).render("errors/500", {
      title: "500 - Server Error",
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong on our end. Please try again later.' 
        : err.message,
      nav
    });
  }
});

// 404 Handler - Must be last route
app.use(async (req, res) => {
  let nav = await utilities.getNav();
  res.status(404).render('errors/404', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    nav
  });
});

// Use environment port for Render
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Visit: http://localhost:${port}`);
  
  // Test database connection
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Database connection test failed:', err);
    } else {
      console.log('Database connection successful:', result.rows[0].now);
    }
  });
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = app;