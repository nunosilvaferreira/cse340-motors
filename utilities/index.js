// utilities/index.js
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")

const utilities = {}

/**
 * Build navigation bar dynamically
 */
utilities.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = '<ul class="main-nav">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  if (data && data.rows) {
    data.rows.forEach((row) => {
      list += `<li><a href="/inv/classification/${row.classification_id}" title="See ${row.classification_name} vehicles">${row.classification_name}</a></li>`
    })
  }
  list += "</ul>"
  return list
}

/**
 * Helpers for formatting and image path
 */
function buildImagePath(img) {
  if (!img) return "/images/no-image.png"
  let p = String(img).trim()
  p = p.replace(/^\/+/, "") // remove leading slashes
  if (!/^images\//.test(p)) {
    p = "images/" + p
  }
  p = p.replace(/\/+/g, "/") // normalize
  return "/" + p
}

function formatNumber(n) {
  const num = Number(n) || 0
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

function formatCurrency(n) {
  const num = Number(n) || 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Build vehicle detail HTML
 */
utilities.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return "<p>Vehicle information not available.</p>"
  }

  const make = vehicle.inv_make || ""
  const model = vehicle.inv_model || ""
  const year = vehicle.inv_year || ""
  const price =
    vehicle.inv_price !== undefined && vehicle.inv_price !== null
      ? formatCurrency(vehicle.inv_price)
      : "N/A"

  const rawMileage =
    vehicle.inv_mileage ||
    vehicle.inv_miles ||
    vehicle.inv_mile ||
    vehicle.mileage
  const mileage =
    rawMileage !== undefined && rawMileage !== null
      ? formatNumber(rawMileage)
      : "N/A"

  const imgFile =
    vehicle.inv_image || vehicle.inv_image_full || "no-image.png"
  const imgSrc = buildImagePath(imgFile)
  const title = `${make} ${model}`.trim()

  const html = `
    <article class="vehicle-detail">
      <figure class="vehicle-image">
        <img src="${imgSrc}" alt="${title}" loading="lazy">
      </figure>

      <section class="vehicle-content">
        <h1 class="vehicle-title">${title}</h1>
        <h2 class="vehicle-subtitle">${year} • ${price}</h2>
        <p class="vehicle-mileage"><strong>Mileage:</strong> ${mileage}</p>
        <div class="vehicle-description">
          ${
            vehicle.inv_description
              ? `<p>${vehicle.inv_description}</p>`
              : "<p>No description available.</p>"
          }
        </div>
        ${
          vehicle.inv_color
            ? `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
            : ""
        }
        ${
          vehicle.inv_transmission
            ? `<p><strong>Transmission:</strong> ${vehicle.inv_transmission}</p>`
            : ""
        }
      </section>
    </article>
  `
  return html
}

// ======================================================
// W05: Error handling wrapper for async controllers
// ======================================================
utilities.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// ======================================================
// W05: JWT Authentication middleware
// ======================================================
utilities.checkJWT = (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = payload
    next()
  } catch (error) {
    console.error("JWT verification failed:", error)
    req.flash("notice", "Session expired. Please log in again.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
}

// Export helpers too
utilities.buildImagePath = buildImagePath
utilities.formatNumber = formatNumber
utilities.formatCurrency = formatCurrency

module.exports = utilities
