const express = require("express");
const router = express.Router();
const db = require("../config/db"); // or wherever your db.js is


// ✅ POST /get patient ID
router.post("/getPatientId", (req, res) => {
    const { uid } = req.body;
    const sql = "SELECT patient_id FROM patients WHERE uid = ?";
    db.query(sql, [uid], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.length === 0) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json({ patient_id: result[0].patient_id });
    });
  });
   

// ✅ POST /check-duplicate-appointment
router.post("/check-duplicate-appointment", (req, res) => {
  const { patient_id, doctor_id } = req.body;

  const sql = `
    SELECT * FROM appointments
    WHERE patient_id = ? AND doctor_id = ?
  `;

  db.query(sql, [patient_id, doctor_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ exists: result.length > 0 });
  });
});

// ✅ GET /doctors/list
router.get("/doctors/list", (req, res) => {
  const sql = `
    SELECT d.doctor_id, u.name, d.specialization 
    FROM doctors d
    JOIN users u ON d.uid = u.uid
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to fetch doctors" });
    res.json(result);
  });
});

// // ✅ POST /appointments/book
// router.post("/appointments/book", (req, res) => {
//   const {
//     patient_id,
//     doctor_id,
//     date,
//     time,
//     specialization,
//     consultant_fee,
//   } = req.body;

//   const query = `
//     INSERT INTO appointments (
//       patient_id, doctor_id, date, time, specialization, consultant_fee
//     ) VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   db.query(
//     query,
//     [patient_id, doctor_id, date, time, specialization, consultant_fee],
//     (err, result) => {
//       if (err) {
//         console.error("❌ Error booking appointment:", err);
//         return res.status(500).json({ error: "Failed to book appointment" });
//       }
//       res.status(201).json({ message: "✅ Appointment booked successfully!" });
//     }
//   );
// });


// ✅ POST /appointments/book + Bill Generation
router.post("/appointments/book", (req, res) => {
    const {
      patient_id,
      doctor_id,
      date,
      time,
      specialization,
      consultant_fee,
    } = req.body;
  
    const appointmentQuery = `
      INSERT INTO appointments (
        patient_id, doctor_id, date, time, specialization, consultant_fee
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      appointmentQuery,
      [patient_id, doctor_id, date, time, specialization, consultant_fee],
      (err, result) => {
        if (err) {
          console.error("❌ Error booking appointment:", err);
          return res.status(500).json({ error: "Failed to book appointment" });
        }
  
        // ✅ Generate bill after successful appointment
        const now = new Date();
        const billDate = now.toISOString().split("T")[0]; // 'YYYY-MM-DD'
        const billTime = now.toTimeString().split(" ")[0]; // 'HH:MM:SS'
  
        const billQuery = `
          INSERT INTO bills (patient_id, date, time, amount)
          VALUES (?, ?, ?, ?)
        `;
  
        db.query(
          billQuery,
          [patient_id, billDate, billTime, consultant_fee],
          (billErr) => {
            if (billErr) {
              console.error("❌ Bill generation failed:", billErr);
              return res.status(500).json({
                error: "Appointment booked but bill not generated",
              });
            }
  
            res.status(201).json({
              message: "✅ Appointment booked and bill generated!",
            });
          }
        );
      }
    );
  });
  

module.exports = router;
