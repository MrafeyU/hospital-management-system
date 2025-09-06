// routes/medicalHistoryRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const db = require("../config/db");

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/history"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// GET /medical-history/:patient_id
router.get("/:patient_id", (req, res) => {
  const { patient_id } = req.params;
  const sql = "SELECT * FROM medical_history WHERE patient_id = ? ORDER BY uploaded_at DESC";
  db.query(sql, [patient_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
});

// POST /medical-history/upload
router.post("/upload", upload.single("file"), (req, res) => {
  const { patient_id, title, description } = req.body;
  const filePath = req.file?.path;

  if (!filePath) return res.status(400).json({ error: "No file uploaded" });

  const sql = "INSERT INTO medical_history (patient_id, title, description, file_path) VALUES (?, ?, ?, ?)";
  db.query(sql, [patient_id, title, description, filePath], (err) => {
    if (err) return res.status(500).json({ error: "Failed to upload history" });
    res.status(201).json({ message: "Medical record uploaded successfully!" });
  });
});

module.exports = router;
