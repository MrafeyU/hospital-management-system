const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { sendCriticalAlertEmail } = require("../utilis/emailService"); // ✅ Add this

// ✅ Load scaler
const scaler = JSON.parse(fs.readFileSync(path.join(__dirname, "../model/sklearn/scaler.json"), "utf-8"));


let latestHardwareVitals = null;

router.post("/vitals/hardware", (req, res) => {
  latestHardwareVitals = {
    heart_rate: req.body.heart_rate,
    respiratory_rate: req.body.respiratory_rate,
    temperature: req.body.temperature,
    oxygen_level: req.body.oxygen_level,
    bp_systolic: req.body.bp_systolic || '',
    bp_diastolic: req.body.bp_diastolic || ''
  };
  console.log("📥 ESP32 Data Received:", latestHardwareVitals);
  res.status(200).json({ message: "Vitals received from hardware" });
});

// Frontend will poll this to get values
router.get("/vitals/latest", (req, res) => {
  res.json(latestHardwareVitals || {});
});



// ✅ POST /vitals/submit
router.post("/submit", async (req, res) => {
  const {
    patient_id,
    heart_rate,
    respiratory_rate,
    temperature,
    oxygen_level,
    bp_systolic,
    bp_diastolic
  } = req.body;

  // ✅ Normalize inputs
  const input = [heart_rate, respiratory_rate, temperature, oxygen_level, bp_systolic, bp_diastolic];
  const normalized = input.map((val, i) => (val - scaler.mean[i]) / scaler.std[i]);

  // ✅ Predict criticality using Python RF model
  const py = spawn("python3", ["predict_rf.py", JSON.stringify(normalized)]);

  let prediction = null;
  py.stdout.on("data", async (data) => {
    const result = JSON.parse(data.toString());
    prediction = result.label;

    // ✅ Save vitals to DB
    const sql = `
      INSERT INTO vitalsigns (ip_id, heart_rate, respiratory_rate, temperature, oxygen_saturation, blood_pressure, timestamp)
      VALUES ((SELECT ip_id FROM inhousepatients WHERE patient_id = ?), ?, ?, ?, ?, CONCAT(?, '/', ?), NOW())
    `;
    db.query(sql, [patient_id, heart_rate, respiratory_rate, temperature, oxygen_level, bp_systolic, bp_diastolic]);

    // ✅ If critical, trigger Firebase email alert to doctor
    if (prediction === 0) {
      // 🟡 Implement Firebase email here
      const query = `
      SELECT DISTINCT du.email AS doctor_email, pu.name AS patient_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN users du ON d.uid = du.uid               -- doctor email
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN users pu ON p.uid = pu.uid               -- patient name
      WHERE p.patient_id = ?
    `;
  
    db.query(query, [patient_id], async (err, results) => {
      if (err) {
        console.error("❌ Error fetching doctor info:", err);
      } else if (results.length > 0) {
        for (const row of results) {
          const { doctor_email, patient_name } = row;
          await sendCriticalAlertEmail(doctor_email, patient_name);
        }
      } else {
        console.log("⚠️ No doctors found via appointments for patient ID", patient_id);
      }
    });
      console.log("⚠️ Patient is critical. Email to doctor must be sent.");
    }

    res.json({ label: prediction });
  });

  py.stderr.on("data", (err) => {
    console.error("❌ ML Prediction Error:", err.toString());
    res.status(500).json({ error: "Prediction failed." });
  });
});

module.exports = router;
