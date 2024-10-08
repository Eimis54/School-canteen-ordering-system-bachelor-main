const nodemailer = require('nodemailer');

const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or any email provider
    auth: {
      user: 'johnesj736@gmail.com',
      pass: 'etxn uojp gqol wmfs',
    },
  });

  const mailOptions = {
    from: 'johnesj736@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
