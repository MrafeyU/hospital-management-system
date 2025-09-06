const express = require('express');
const db = require('../config/db');
const admin = require('firebase-admin');
const router = express.Router();

// Firebase Admin SDK
const serviceAccount = require('../firebase/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// API to Register Users
router.post('/register', async (req, res) => {
    const { name, email, role,password } = req.body;

    // Create User in Firebase Authentication
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password: password, // Temporary password (users should reset)
            displayName: name,
        });

        // Insert user into MySQL
        const sql = `INSERT INTO users (uid, email, name, role) VALUES (?, ?, ?, ?)`;
        db.query(sql, [userRecord.uid, email, name, role], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database Insert Error' });
            }
            res.status(201).json({ message: 'User registered successfully', userRecord });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;