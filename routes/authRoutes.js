const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendResetEmail = require("../utils/sendResetEmail");

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ error: "Please provide all fields" });
    }

    const userExists = await db.User.findOne({ where: { Email: email } });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const newUser = await db.User.create({
      Name: name,
      Surname: surname,
      Email: email,
      PasswordHash: hashedPassword,
      RoleID: 1,
      verificationCode: verificationCode,
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userID: newUser.UserID,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/verify-email", async (req, res) => {
  const { userID, verificationCode } = req.body;

  try {
    const user = await db.User.findOne({ where: { UserID: userID } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/verify/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const user = await db.User.findOne({ where: { verificationCode: code } });

    if (!user) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Verification failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "Verification email resent." });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ errorCode: "USER_NOT_FOUND" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ errorCode: "EMAIL_NOT_VERIFIED" });
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ errorCode: "INVALID_CREDENTIALS" });
    }
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const token = jwt.sign({ id: user.UserID }, secretKey);

    res.json({
      token,
      UserID: user.UserID,
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ errorCode: "SERVER_ERROR" });
  }
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.User.findOne({ where: { Email: email } });

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    await sendResetEmail(user.Email, resetLink);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ error: "SERVER_ERROR" });
  }
});
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await db.User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.PasswordHash = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
