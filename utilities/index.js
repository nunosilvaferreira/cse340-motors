// utilities/index.js
const invModel = require("../models/inventory-model");

const utilities = {};

/**
 * Build navigation bar dynamically
 */
utilities.getNav = async function () {
  const data = await invModel.getClassifications();
  let list = '<ul class="main-nav">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  if (data && data.rows) {
    data.rows.forEach((row) => {
      list += `<li><a href="/inv/classification/${row.classification_id}" title="See ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });
  }
  list += "</ul>";
  return list;
};

/**
 * Build vehicle detail HTML
 */
utilities.buildVehicleDetail = function (vehicle) {
  if (!vehicle) {
    return "<p>Vehicle information not available.</p>";
  }

  const fmtCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const fmtNumber = new Intl.NumberFormat("en-US");

  const make = vehicle.inv_make || "";
  const model = vehicle.inv_model || "";
  const year = vehicle.inv_year || "";
  const price =
    vehicle.inv_price !== undefined && vehicle.inv_price !== null
      ? fmtCurrency.format(Number(vehicle.inv_price))
      : "N/A";
  const rawMileage =
    vehicle.inv_mileage ||
    vehicle.inv_miles ||
    vehicle.inv_mile ||
    vehicle.mileage;
  const mileage =
    rawMileage !== undefined && rawMileage !== null
      ? fmtNumber.format(Number(rawMileage))
      : "N/A";

  const imgFile =
    vehicle.inv_image || vehicle.inv_image_full || "no-image.png";
  const imgSrc = `/images/${imgFile}`;
  const title = `${make} ${model}`.trim();

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
        ${vehicle.inv_color ? `<p><strong>Color:</strong> ${vehicle.inv_color}</p>` : ""}
        ${
          vehicle.inv_transmission
            ? `<p><strong>Transmission:</strong> ${vehicle.inv_transmission}</p>`
            : ""
        }
      </section>
    </article>

    <style>
      .vehicle-detail { display:flex; gap:1.25rem; align-items:flex-start; margin:1rem 0; }
      .vehicle-image img { max-width:100%; height:auto; border-radius:6px; }
      .vehicle-image { flex:1 1 45%; }
      .vehicle-content { flex:1 1 55%; }
      .vehicle-title { margin:0 0 0.25rem 0; font-size:1.6rem; }
      .vehicle-subtitle { margin:0 0 0.8rem 0; color:#333; font-size:1.1rem; }
      .vehicle-mileage { margin:0 0 1rem 0; }
      @media (max-width: 768px) {
        .vehicle-detail { flex-direction:column; }
      }
    </style>
  `;
  return html;
};

module.exports = utilities;
