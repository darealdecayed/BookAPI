// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool(); // uses .env for config

module.exports = pool;
