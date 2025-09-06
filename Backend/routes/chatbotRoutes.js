// // routes/chatbotRoutes.js
// const express = require('express');
// const router = express.Router();
// const fetch = require('node-fetch');

// // POST /chatbot
// router.post('/chatbot', async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         contents: [{
//           parts: [{ text: message }]
//         }]
//       })
//     });

//     const data = await geminiRes.json();

//     const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
//     res.json({ response: reply });
//   } catch (err) {
//     console.error("❌ Gemini API error:", err);
//     res.status(500).json({ error: "Server error while processing chatbot request." });
//   }
// });

// module.exports = router;








const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const db = require('../config/db'); // Ensure this exists

// 🔐 Chatbot that includes user role & optional data
router.post('/chatbot', async (req, res) => {
  const { message, uid, role } = req.body;

  if (!message || !uid || !role) {
    return res.status(400).json({ error: "Message, UID, and Role are required." });
  }

  try {
    // 🔄 Optional: Fetch role-specific data
    let userContext = "";

    if (role === "doctor") {
      const [rows] = await db.promise().query(`
        SELECT name, specialization FROM doctors d
        JOIN users u ON u.uid = d.uid
        WHERE d.uid = ?`, [uid]);
      const doc = rows[0];
      if (doc) {
        userContext = `You are Dr. ${doc.name}, specialized in ${doc.specialization}.`;
      }
    } else if (role === "patient") {
      const [rows] = await db.promise().query(`
        SELECT u.name FROM users u
        JOIN patients p ON u.uid = p.uid
        WHERE u.uid = ?`, [uid]);
      const patient = rows[0];
      if (patient) {
        userContext = `You are a patient named ${patient.name}.`;
      }
    } else if (role === "admin") {
      const [rows] = await db.promise().query(`SELECT name FROM users WHERE uid = ?`, [uid]);
      const admin = rows[0];
      if (admin) {
        userContext = `You are an admin named ${admin.name}.`;
      }
    }

    const prompt = `${userContext} The user says: "${message}". Please reply appropriately.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    res.json({ response: reply });

  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ error: "Server error while processing chatbot request." });
  }
});

module.exports = router;
