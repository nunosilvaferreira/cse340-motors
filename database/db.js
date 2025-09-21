// database/db.js
const { Pool } = require("pg")

// Use DATABASE_URL if available (Render), otherwise fall back to local settings
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/motors_nuip"

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
})

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err)
  process.exit(-1)
})

module.exports = pool
