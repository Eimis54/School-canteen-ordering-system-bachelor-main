const nodemailer = require('nodemailer');

// Create a transporter using your email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to another service if you want
  auth: {
    user: 'johnesj736@gmail.com', // Your email address
    pass: 'etxn uojp gqol wmfs', // Your email password or app password
  },
});

// Function to send the verification email
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: 'johnesj736@gmail.com', // Your email address
    to: email, // The user's email address
    subject: 'Email Verification',
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = sendVerificationEmail;
