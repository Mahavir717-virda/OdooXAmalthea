const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // make sure this exists
const router = express.Router();

// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, country } = req.body;

    if (!fullName || !email || !password || !country) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      country,
    });

    await newUser.save();

    res.json({ success: true, message: "Account created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
