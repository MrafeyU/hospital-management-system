// /routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// ✅ GET all reports
router.get("/", (req, res) => {
  const sql = "SELECT * FROM reports ORDER BY generated_on DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ POST generate a dummy report (metadata only)
router.post("/generate", async (req, res) => {
  const { title, uid } = req.body;

  // Generate fake PDF report path
  const fileName = `report_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, `../reports/${fileName}`);

  // Simulate file creation
  fs.writeFileSync(filePath, "Sample Report Content");

  const relativePath = `/reports/${fileName}`;

  const sql = `INSERT INTO reports (report_title, generated_by, file_path)
               VALUES (?, ?, ?)`;

  db.query(sql, [title, uid, relativePath], (err, result) => {
    if (err) {
      console.error("Error saving report:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(201).json({ message: "Report generated", path: relativePath });
  });
});

module.exports = router;
