// server.js
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

// Load environment variables early
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const pool = require("./database/db");
const utilities = require("./utilities/");

const app = express();

// Layouts
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
const indexRouter = require("./routes/index");
const inventoryRoutes = require("./routes/inventory-routes");

app.use("/", indexRouter);
app.use("/inv", inventoryRoutes);

// 404 handler
app.use(async (req, res) => {
  const nav = await utilities.getNav();
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist.",
    nav,
  });
});

// Error handler
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at "${req.originalUrl}":`, err);
  if (err.status === 404) {
    res.status(404).render("errors/404", {
      title: "404 - Page Not Found",
      message: err.message,
      nav,
    });
    return;
  }
  res.status(500).render("errors/500", {
    title: "500 - Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong on our end. Please try again later."
        : err.message,
    nav,
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);

  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      console.error("Database connection test failed:", err.message);
    } else {
      console.log("Database connection OK:", result.rows[0].now);
    }
  });
});

module.exports = app;
