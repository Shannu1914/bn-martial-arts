require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const { db, init } = require('./db');
const enrollmentRoutes = require('./routes/enrollment');

const app = express();
const PORT = process.env.PORT || 4000;

// initialize DB schema if not exist
init();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/enroll', enrollmentRoutes);

// health
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// create initial admin if none exists
function ensureAdminSeed() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@karate.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  db.get('SELECT id FROM admins LIMIT 1', [], (err, row) => {
    if (err) return console.error('Error checking admin', err);
    if (!row) {
      bcrypt.hash(adminPassword, 10, (err, hash) => {
        if (err) return console.error('Hash error', err);
        db.run('INSERT INTO admins (email, password_hash) VALUES (?, ?)', [adminEmail, hash], (err2) => {
          if (err2) return console.error('Failed to seed admin', err2);
          console.log(`Seeded admin ${adminEmail} (change .env ADMIN_PASSWORD now)`);
        });
      });
    } else {
      console.log('Admin exists. No seed.');
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not set. Use .env to set a strong secret.');
  }
  ensureAdminSeed();
});
