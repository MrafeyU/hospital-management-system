// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,           // 🔁 Replace with your Gmail
    pass: process.env.EMAIL_PASS,         // 🔁 Use App Password (NOT Gmail password)
  },
});

const sendCriticalAlertEmail = async (to, patientName) => {
  const mailOptions = {
    from: `"HMS Alert System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "⚠️ Critical Patient Alert",
    text: `Dear Doctor,\n\nPatient ${patientName} is in critical condition based on real-time vitals.\nPlease respond immediately.\n\nRegards,\nHospital Management System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendCriticalAlertEmail };