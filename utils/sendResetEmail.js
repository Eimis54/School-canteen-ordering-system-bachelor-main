require('dotenv').config();
const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.REACT_APP_AUTH_USERNAME,
      pass: process.env.REACT_APP_AUTH_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.REACT_APP_AUTH_USERNAME,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
