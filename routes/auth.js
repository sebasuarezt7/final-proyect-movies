const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

// LOGIN GET
router.get("/login", (req, res) => {
  res.render("login", { errors: [] });
});

// LOGIN POST
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const errors = [];

  const user = await User.findOne({ username });

  if (!user) errors.push("User does not exist");
  if (user && user.password !== password)
    errors.push("Incorrect password");

  if (errors.length > 0) {
    return res.render("login", { errors });
  }

  req.session.user = user;

  res.redirect("/");
});

// REGISTER GET
router.get("/register", (req, res) => {
  res.render("register", { errors: [] });
});

// REGISTER POST
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username) errors.push("Username is required");
  if (!password || password.length < 6)
    errors.push("Password must be at least 6 characters");

  const existingUser = await User.findOne({ username });
  if (existingUser) errors.push("Username already exists");

  if (errors.length > 0) {
    return res.render("register", { errors });
  }

  await User.create({ username, password });

  res.redirect("/login");
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;