// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const helmet = require("helmet");
const compression = require("compression");
const pool = require("./database/db");
const utilities = require("./utilities/");

const app = express();

/* ---------------------------
   Middleware Configuration
---------------------------- */

// Use Helmet for basic security headers
app.use(helmet());

// Gzip compression for faster performance
app.use(compression());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Layout engine
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Cookies
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "motors-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    },
  })
);

// Flash messages
app.use(flash());

// Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

/* ---------------------------
   View Engine Configuration
---------------------------- */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Expose common utility functions to all views
app.locals.buildImagePath = utilities.buildImagePath;
app.locals.formatCurrency = utilities.formatCurrency;
app.locals.formatNumber = utilities.formatNumber;

/* ---------------------------
   Route Setup
---------------------------- */
const indexRouter = require("./routes/index");
const inventoryRoutes = require("./routes/inventory-routes");
const accountRoutes = require("./routes/account-routes");
const reviewRoutes = require("./routes/review-routes"); // ✅ Reviews route

app.use("/", indexRouter);
app.use("/inv", inventoryRoutes);
app.use("/account", accountRoutes);
app.use("/reviews", reviewRoutes); // ✅ Register reviews

/* ---------------------------
   Error Handlers
---------------------------- */

// 404 Not Found
app.use(async (req, res) => {
  try {
    const nav = await utilities.getNav();
    res.status(404).render("errors/404", {
      title: "404 - Page Not Found",
      message: "The page you are looking for does not exist.",
      nav,
    });
  } catch (error) {
    console.error("Error generating 404 page:", error);
    res.status(404).send("404 - Page Not Found");
  }
});

// 500 and other errors
app.use(async (err, req, res, next) => {
  console.error(`Error at "${req.originalUrl}":`, err);

  try {
    const nav = await utilities.getNav();
    res.status(err.status || 500).render("errors/500", {
      title: `${err.status || 500} - Server Error`,
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong on our end. Please try again later."
          : err.message,
      nav,
    });
  } catch (renderErr) {
    console.error("Error rendering 500 page:", renderErr);
    res.status(500).send("500 - Internal Server Error");
  }
});

/* ---------------------------
   Start Server
---------------------------- */
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`✅ Server running on http://localhost:${port}`);

  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection OK:", result.rows[0].now);
  } catch (err) {
    console.error("⚠️ Database connection test failed:", err.message);
  }
});

module.exports = app;
