const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const sendResetEmail = require('../utils/sendResetEmail');

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
};

router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    const userExists = await db.User.findOne({ where: { Email: email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode(); // Generate code

    const newUser = await db.User.create({
      Name: name,
      Surname: surname,
      Email: email,
      PasswordHash: hashedPassword,
      RoleID: 1,
      verificationCode: verificationCode // Store the code
    });

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      userID: newUser.UserID
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/verify-email', async (req, res) => {
  const { userID, verificationCode } = req.body;

  try {
    const user = await db.User.findOne({ where: { UserID: userID } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update the user's status to verified
    user.isVerified = true;
    user.verificationCode = null; // Clear the code
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/verify/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Find the user by the verification code
    const user = await db.User.findOne({ where: { verificationCode: code } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verificationCode = null; // Clear the verification code
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verification failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    // Generate a new verification code
    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification email resent.' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await db.User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user.UserID }, 'your_secret_key_here');

    res.json({ 
      token, 
      UserID: user.UserID
    });

  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate a reset token and expiry date
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

    // Store the reset token and expiration in the user record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send the reset email with the token
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`; // Adjust your frontend URL
    await sendResetEmail(user.Email, resetLink);

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    // Find the user with the reset token and check if the token is still valid
    const user = await db.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() } // Token should not be expired
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token fields
    user.PasswordHash = hashedPassword;
    user.resetPasswordToken = null; // Clear token
    user.resetPasswordExpires = null; // Clear expiration
    await user.save();

    res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
