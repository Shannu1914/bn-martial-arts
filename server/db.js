const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'karate.db');

const dbExists = fs.existsSync(DB_PATH);
const db = new sqlite3.Database(DB_PATH);

function init(sqlFile = path.join(__dirname, 'init.sql')) {
  if (!dbExists) {
    const initSQL = fs.readFileSync(sqlFile, 'utf8');
    db.exec(initSQL, (err) => {
      if (err) console.error('Failed to initialize DB', err);
      else console.log('Database initialized from init.sql');
    });
  } else {
    console.log('Database file exists, skipping init.');
  }
}

module.exports = { db, init };
