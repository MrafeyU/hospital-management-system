require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseAdminConfig.json");
const cors = require("cors");
const adminStatsRoutes = require('./routes/adminStats');
const adminRoutes = require('./routes/adminRoutes');
const adminAppointmentsRoutes = require('./routes/adminAppointments');
const reportRoutes = require("./routes/reportRoutes");
const path = require("path");
const appointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const vitalsRoutes = require("./routes/vitalsRoutes");
const predictVitalsRoute = require("./routes/predictVitals");
// const bodyParser = require("body-parser");


// app.use(bodyParser.json());


require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// Serve reports folder publicly
app.use("/reports", express.static(path.join(__dirname, "reports")));

// ✅ Create MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database!");
});



// ✅ Test API Route
app.get("/", (req, res) => {
  res.send("🚀 API is working!");
});

// ✅ Import Firebase Auth Function
const { createFirebaseUser } = require("./firebaseAuth");


//  --------------------- ✅ Register a new user (Doctor, Patient, or Admin) ---------------------

// ✅ POST /register
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  try {
    const firebaseUser = await createFirebaseUser(email, password, role);
    if (!firebaseUser) {
      return res.status(500).json({ error: "Firebase registration failed" });
    }

    const firebaseUid = firebaseUser.uid;

    // ✅ Insert into users table
    const userSql = "INSERT INTO users (uid, name, email, role) VALUES (?, ?, ?, ?)";
    db.query(userSql, [firebaseUid, name, email, role], (err, result) => {
      if (err) {
        console.error("❌ Error inserting user into MySQL:", err);
        return res.status(500).json({ error: "Database error during user insert" });
      }

      console.log("✅ User inserted into users table");

      // ✅ Insert into respective table based on role
      if (role === "doctor") {
        const doctorSql = "INSERT INTO doctors (uid) VALUES (?)";
        db.query(doctorSql, [firebaseUid], (err) => {
          if (err) {
            console.error("❌ Error inserting into doctors table:", err);
            return res.status(500).json({ error: "Database error during doctor insert" });
          }
          res.json({ message: "✅ Doctor registered successfully!", userId: firebaseUid });
        });

      } else if (role === "patient") {
        const patientSql = "INSERT INTO patients (uid) VALUES (?)";
        db.query(patientSql, [firebaseUid], (err, patientResult) => {
          if (err) {
            console.error("❌ Error inserting into patients table:", err);
            return res.status(500).json({ error: "Database error during patient insert" });
          }

          const patientId = patientResult.insertId; // Auto-increment ID of newly inserted patient

          const inhouseSql = "INSERT INTO inhousepatients (patient_id, admission_date, status) VALUES (?, CURDATE(), 'Admitted')";
          db.query(inhouseSql, [patientId], (err) => {
            if (err) {
              console.error("❌ Error inserting into inhousepatients table:", err);
              return res.status(500).json({ error: "Database error during inhouse patient insert" });
            }

            res.json({ message: "✅ Patient registered successfully!", userId: firebaseUid });
          });
        });

      } else if (role === "admin") {
        const adminSql = "INSERT INTO admins (uid) VALUES (?)";
        db.query(adminSql, [firebaseUid], (err) => {
          if (err) {
            console.error("❌ Error inserting into admins table:", err);
            return res.status(500).json({ error: "Database error during admin insert" });
          }
          res.json({ message: "✅ Admin registered successfully!", userId: firebaseUid });
        });

      } else {
        res.status(400).json({ error: "Invalid role specified." });
      }
    });

  } catch (error) {
    console.error("❌ Error in registration process:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
//  --------------------- ✅ Get User Role and In-House Status ---------------------

app.post("/getUserRole", async (req, res) => {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "UID is required" });

    try {
        // First, get the user's role
        const userQuery = "SELECT role FROM users WHERE uid = ?";
        db.query(userQuery, [uid], (err, userResults) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (userResults.length === 0) return res.status(404).json({ error: "User not found" });

            const role = userResults[0].role;

            // If user is doctor or admin, return the role
            if (role === "doctor" || role === "admin") {
                return res.json({ role });
            }

            // If user is a patient, check if they are in the inhousepatients table
            const inHouseQuery = `
                SELECT EXISTS(
                    SELECT 1 FROM inhousepatients 
                    WHERE patient_id = (SELECT patient_id FROM patients WHERE uid = ?)
                ) AS in_house;
            `;

            db.query(inHouseQuery, [uid], (err, inHouseResults) => {
                if (err) return res.status(500).json({ error: "Database error" });

                const inHouse = inHouseResults[0].in_house === 1; // Convert to boolean
                res.json({ role, in_house: inHouse });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

//  --------------------- ADMIN APIS ---------------------
// ADMIN API 
app.get("/api/admin/user-stats", (req, res) => {
  const sql = `
    SELECT 
      SUM(role = 'admin') AS admin,
      SUM(role = 'doctor') AS doctor,
      SUM(role = 'patient') AS patient
    FROM users
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching user stats:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const stats = results[0];
    res.json(stats);
  });
});

app.use("/api/admin", adminRoutes);


// server.js or a route file like routes/userRoutes.js
app.get("/api/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(results);
  });
});


// DELETE /api/users/:uid
app.delete("/api/users/:uid", (req, res) => {
  const uid = req.params.uid;
  const query = "DELETE FROM users WHERE uid = ?";
  db.query(query, [uid], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully!" });
  });
});

// fetch appointments from db
app.use('/api/admin', adminAppointmentsRoutes);
app.use("/api/reports", reportRoutes);


//  --------------------- PATIENTS APIS ---------------------

app.use("/", appointmentRoutes);
app.use("/", patientRoutes);

app.use("/medical-history", require("./routes/medicalHistoryRoutes"));
app.use("/uploads/history", express.static(path.join(__dirname, "uploads/history")));

app.use("/", predictVitalsRoute);
app.use("/vitals", vitalsRoutes);



//  --------------------- DOCTOR APIS ---------------------

app.use('/doctor', doctorRoutes);



//  --------------------- ChatBot API ---------------------
app.use('/', chatbotRoutes);






app.listen(PORT, () => {
  console.log("🚀 Server is running on port ${PORT}");
});

