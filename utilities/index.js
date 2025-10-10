// utilities/index.js
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")

const utilities = {}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  if (!unsafe) return ""
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Build navigation bar dynamically
 */
utilities.getNav = async function () {
  try {
    const data = await invModel.getClassifications()
    let list = '<ul class="main-nav">'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    
    if (data && data.rows) {
      data.rows.forEach((row) => {
        list += `<li><a href="/inv/classification/${row.classification_id}" title="See ${row.classification_name} vehicles">${row.classification_name}</a></li>`
      })
    } else if (data && Array.isArray(data)) {
      // Handle case where data is already an array
      data.forEach((row) => {
        list += `<li><a href="/inv/classification/${row.classification_id}" title="See ${row.classification_name} vehicles">${row.classification_name}</a></li>`
      })
    }
    
    list += '<li><a href="/inv/inventory" title="See all vehicles">All Vehicles</a></li>'
    list += "</ul>"
    return list
  } catch (error) {
    console.error("Error building navigation:", error)
    // Return basic navigation as fallback
    return `
      <ul class="main-nav">
        <li><a href="/" title="Home page">Home</a></li>
        <li><a href="/inv/inventory" title="See all vehicles">All Vehicles</a></li>
      </ul>
    `
  }
}

/**
 * Build inventory grid for classification pages
 */
utilities.buildInventoryGrid = function (data) {
  if (!data || data.length === 0) {
    return "<p>No vehicles found in this classification.</p>";
  }

  let grid = '<div class="inventory-grid">';
  data.forEach((item) => {
    const img = utilities.buildImagePath(item.inv_thumbnail || item.inv_image);
    const name = `${item.inv_make} ${item.inv_model}`;
    grid += `
      <div class="vehicle-card">
        <a href="/inv/detail/${item.inv_id}">
          <img src="${img}" 
               alt="Image of ${name}" 
               class="vehicle-thumb" 
               loading="lazy">
        </a>
        <div class="vehicle-info">
          <h3><a href="/inv/detail/${item.inv_id}">${name}</a></h3>
          <p class="vehicle-year"><strong>Year:</strong> ${item.inv_year}</p>
          <p class="vehicle-price"><strong>Price:</strong> ${utilities.formatCurrency(item.inv_price)}</p>
          ${
            item.inv_miles
              ? `<p class="vehicle-miles"><strong>Mileage:</strong> ${utilities.formatNumber(item.inv_miles)} miles</p>`
              : ""
          }
          ${
            item.inv_description
              ? `<p class="vehicle-description">${escapeHtml(item.inv_description.substring(0, 100))}...</p>`
              : ""
          }
          <a href="/inv/detail/${item.inv_id}" class="btn btn-primary">View Details</a>
        </div>
      </div>`;
  });
  grid += "</div>";
  return grid;
};


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
 * Build vehicle detail HTML (W06 updated with reviews)
 */
utilities.buildVehicleDetail = function (vehicle, reviews = []) {
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

  let html = `
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

  // Append reviews section
  let reviewsHtml = `
    <section class="reviews">
      <h3>Customer Reviews</h3>
  `
  if (reviews && reviews.length > 0) {
    reviewsHtml += "<ul>"
    reviews.forEach((r) => {
      const safeName = escapeHtml(r.reviewer_name)
      const safeText = escapeHtml(r.review_text)
      reviewsHtml += `<li>
        <strong>${safeName}</strong> — ${new Date(r.review_date).toLocaleString()}<br/>
        Rating: ${Number(r.rating)}/5
        <p>${safeText}</p>
      </li>`
    })
    reviewsHtml += "</ul>"
  } else {
    reviewsHtml += "<p>No reviews yet. Be the first to review this vehicle!</p>"
  }

  reviewsHtml += `
      <form action="/reviews/add" method="post" class="review-form">
        <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
        <label for="reviewer_name">Your name</label>
        <input type="text" name="reviewer_name" id="reviewer_name" required>

        <label for="rating">Rating (1-5)</label>
        <select name="rating" id="rating">
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>

        <label for="review_text">Review</label>
        <textarea name="review_text" id="review_text" required></textarea>

        <button type="submit" class="btn btn-primary">Post Review</button>
      </form>
    </section>`

  return html + reviewsHtml
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

/* ****************************************
 * Check account type for authorization
 **************************************** */
utilities.checkAccountType = (requiredType) => {
  return (req, res, next) => {
    const accountData = res.locals.accountData
    
    if (!accountData) {
      req.flash("notice", "Please log in to access this page.")
      return res.redirect("/account/login")
    }
    
    if (accountData.account_type === requiredType || accountData.account_type === "Admin") {
      next()
    } else {
      req.flash("notice", "You are not authorized to access this page.")
      res.redirect("/account/")
    }
  }
}

// Export helpers too
utilities.buildImagePath = buildImagePath
utilities.formatNumber = formatNumber
utilities.formatCurrency = formatCurrency

module.exports = utilities
