// database/db.js
const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/motors";

const poolConfig = {
  connectionString,
};

// If Render or external DB, enable SSL
if (connectionString && connectionString.includes("render.com")) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
