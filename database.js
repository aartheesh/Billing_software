const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

// Ensure ./data folder exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, "billing.db");
const db = new Database(dbPath);

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    hsnCode TEXT,
    price REAL,
    stock INTEGER,
    gstRate REAL
  )
`).run();

module.exports = db;


