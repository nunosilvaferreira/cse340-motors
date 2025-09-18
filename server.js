// server.js
const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
const pool = require("./database/db") // Database connection
const utilities = require("./utilities/") // Utilities module

// Load environment variables early
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// Initialize express app
const app = express()

// Middleware
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Static assets
app.use(express.static(path.join(__dirname, "public")))

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Views setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// Routes
const indexRouter = require("./routes/index")
const inventoryRoutes = require("./routes/inventory-routes")

app.use("/", indexRouter)
app.use("/inv", inventoryRoutes)

// 404 handler (must be last route before error middleware)
app.use(async (req, res) => {
  const nav = await utilities.getNav()
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist.",
    nav,
  })
})

// Error handler middleware
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  if (err.status === 404) {
    res.status(404).render("errors/404", {
      title: "404 - Page Not Found",
      message: err.message,
      nav,
    })
  } else {
    res.status(500).render("errors/500", {
      title: "500 - Server Error",
      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong on our end. Please try again later."
          : err.message,
      nav,
    })
  }
})

// Start server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)

  // Test database connection
  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      console.error("Database connection test failed:", err)
    } else {
      console.log("Database connection successful:", result.rows[0].now)
    }
  })
})

module.exports = app
