// firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseAdminConfig.json"); // ✅ Your Firebase service account

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;