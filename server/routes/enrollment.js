const express = require('express');
const router = express.Router();
const { db } = require('../db');
const auth = require('../middleware/authMiddleware');

/* PUBLIC: submit enrollment */
router.post('/', (req, res) => {
  const {
    student_name,
    age,
    school,
    parent_name,
    phone,
    class_preference,
    message
  } = req.body;

  if (!student_name || !phone) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  db.run(
    `INSERT INTO enrollments 
     (student_name, age, school, parent_name, phone, class_preference, message)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [student_name, age, school, parent_name, phone, class_preference, message],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ success: true });
    }
  );
});

/* ADMIN: view enrollments */
router.get('/', auth, (req, res) => {
  db.all(
    'SELECT * FROM enrollments ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
});
router.get('/mine', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM enrollments WHERE user_id = ?',
    [req.user.id],
    (err, rows) => res.json(rows)
  );
});

module.exports = router;
