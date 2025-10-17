// Real login controller using PostgreSQL + bcrypt + JWT
// Env required: PG* for DB (or Pool defaults), JWT_SECRET, optional JWT_EXPIRES_IN, ALLOW_PLAINTEXT_PASSWORDS

const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const ALLOW_PLAINTEXT = String(process.env.ALLOW_PLAINTEXT_PASSWORDS || 'false').toLowerCase() === 'true';

async function login(req, res) {
  try {
    const { username, email, password } = req.body || {};
    if (!password || (!username && !email)) {
      return res.status(400).json({ success: false, error: 'Missing username/email or password' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, error: 'Server not configured: missing JWT_SECRET' });
    }

    // Look up user by email or username
    const result = await pool.query(
      `SELECT id, username, email, password_hash, password
       FROM users
       WHERE ($1::text IS NOT NULL AND email = $1)
          OR ($2::text IS NOT NULL AND username = $2)
       LIMIT 1`,
      [email || null, username || null]
    );

    const user = result.rows?.[0];
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const storedHash = user.password_hash;
    const storedPlain = user.password;
    let valid = false;

    if (storedHash) {
      valid = await bcrypt.compare(password, storedHash).catch(() => false);
    } else if (storedPlain && ALLOW_PLAINTEXT) {
      valid = password === storedPlain;
    }

    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}

module.exports = { login };
