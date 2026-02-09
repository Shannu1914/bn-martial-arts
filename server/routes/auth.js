const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // ✅ ADD THIS EXACTLY HERE
      res.json({
        token,
        role: user.role
      });
    }
  );
});

router.get('/me', authMiddleware, (req, res) => {
  db.get(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => res.json(user)
  );
});

module.exports = router;
