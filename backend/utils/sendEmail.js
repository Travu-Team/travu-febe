const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: parseInt(process.env.SMTP_PORT) === 465, // true untuk port 465, false untuk 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Travu Support" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Gagal mengirim email:', err);
  }
};

module.exports = sendEmail;