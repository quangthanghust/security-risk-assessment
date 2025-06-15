require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(to, subject, text) {
  await transporter.sendMail({
    from: `"Security Risk App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
}

module.exports = sendMail;