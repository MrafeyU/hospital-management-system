const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET Appointment Stats for Admin Dashboard
router.get("/appointment-stats", (req, res) => {
  const query = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN date >= CURDATE() THEN 1 ELSE 0 END) AS upcoming,
      0 AS completed,
      0 AS cancelled
    FROM appointments
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching appointment stats:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const { total, upcoming, completed, cancelled } = results[0];

    res.json({
      total,
      upcoming,
      completed,   // You can update these if you add status field later
      cancelled
    });
  });
});
router.get("/bar-chart/user-role", (req, res) => {
    const sql = `
      SELECT role AS label, COUNT(*) AS value
      FROM users
      GROUP BY role;
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(results);
    });
  });


  // 📦 Fetch all billing records with patient names
router.get("/billing", (req, res) => {
    const sql = `
      SELECT 
        b.bill_no,
        b.date,
        b.time,
        b.amount,
        p.patient_id,
        u.name AS patient_name
      FROM bills b
      JOIN patients p ON b.patient_id = p.patient_id
      JOIN users u ON p.uid = u.uid
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("❌ Error fetching bills:", err);
        return res.status(500).json({ error: "Database error while fetching bills" });
      }
      res.json(results);
    });
  });
  


module.exports = router;
