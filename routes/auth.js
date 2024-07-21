const express = require("express");
const router = express.Router();
const { Users } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register route
router.post("/register", async (req, res, next) => {
  try {
    const { email, name, password, role } = req.body;
    console.log("Creating user:", email, role);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      email,
      name,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    next(err);
  }
});

// Login route
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    // Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not Found" });
    }

    // Periksa password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Password does not Match" });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );
    console.log("Login successful:", email);
    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
  }
});

module.exports = router;
