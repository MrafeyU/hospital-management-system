// routes/adminStats.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ Get total users by role
router.get("/user-counts", (req, res) => {
  const query = `
    SELECT role, COUNT(*) AS count 
    FROM users 
    GROUP BY role
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// ✅ Get total appointments
router.get("/appointments", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM appointments", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results[0]);
  });
});

// ✅ Get upcoming appointments
router.get("/appointments/upcoming", (req, res) => {
  const query = `
    SELECT COUNT(*) AS upcoming 
    FROM appointments 
    WHERE date >= CURDATE()
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results[0]);
  });
});

// ✅ Get billing total
router.get("/billing/total", (req, res) => {
  const query = `SELECT SUM(amount) AS total_amount FROM bills`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results[0]);
  });
});

module.exports = router;
