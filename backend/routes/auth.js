const router = require('express').Router();

// --- LOGIN ENDPOINT ---
router.route('/login').post((req, res) => {
  const { password } = req.body;

  // Check if the provided password matches the one in our .env file
  if (password === process.env.ADMIN_PASSWORD) {
    // Passwords match. Create a session.
    req.session.isLoggedIn = true;
    res.status(200).json({ message: 'Login successful' });
  } else {
    // Passwords do not match.
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// --- LOGOUT ENDPOINT ---
router.route('/logout').post((req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid'); // The default session cookie name
    res.status(200).json({ message: 'Logout successful' });
  });
});

// --- CHECK LOGIN STATUS ENDPOINT ---
router.route('/status').get((req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({ isLoggedIn: true });
  } else {
    res.status(200).json({ isLoggedIn: false });
  }
});

module.exports = router;