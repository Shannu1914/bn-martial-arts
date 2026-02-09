const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../db');
const auth = require('../middleware/authMiddleware');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fname = Date.now() + '_' + Math.random().toString(36).slice(2,9) + ext;
    cb(null, fname);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Public: list students
router.get('/', (req, res) => {
  db.all('SELECT id, name, age, grade, photo_filename, notes FROM students ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows.map(r => ({
      ...r,
      photo_url: r.photo_filename ? `/uploads/${r.photo_filename}` : null
    })));
  });
});

// Admin: add student with photo
router.post('/', auth, upload.single('photo'), (req, res) => {
  const { name, age, grade, notes } = req.body;
  const photo = req.file;
  if (!name) return res.status(400).json({ message: 'Name required' });

  const filename = photo ? photo.filename : null;
  db.run('INSERT INTO students (name, age, grade, photo_filename, notes) VALUES (?, ?, ?, ?, ?)',
    [name, age || null, grade || null, filename, notes || null],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json({ id: this.lastID });
    });
});

// Admin: delete student (and file)
router.delete('/:id', auth, (req, res) => {
  const id = req.params.id;
  db.get('SELECT photo_filename FROM students WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });

    db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
      if (err) return res.status(500).json({ message: 'DB delete error' });
      if (row.photo_filename) {
        const full = path.join(uploadDir, row.photo_filename);
        fs.unlink(full, () => {}); // ignore error
      }
      res.json({ deleted: true });
    });
  });
});

module.exports = router;
