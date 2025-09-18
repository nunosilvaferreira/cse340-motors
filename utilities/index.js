// utilities/index.js
const invModel = require("../models/inventory-model")

const utilities = {}

/* 
 * Gera a navegação dinâmica
 * Exemplo: <ul><li><a href="/">Home</a></li>...</ul>
 */
utilities.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += `<li><a href="/inventory/classification/${row.classification_id}" 
              title="See our inventory of ${row.classification_name} vehicles">
              ${row.classification_name}</a></li>`
  })
  list += "</ul>"
  return list
}

module.exports = utilities
