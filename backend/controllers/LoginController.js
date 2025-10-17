// Dummy login controller for POST /api/login
// Accepts { username, password, email } and returns success if username is 'user' and password is 'pass'

const login = (req, res) => {
  const { username, password, email } = req.body || {};
  if (username === 'user' && password === 'pass') {
    return res.json({ success: true, message: 'Login successful!' });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
};

module.exports = { login };
