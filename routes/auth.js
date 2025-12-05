const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", { errors: [] });
});

router.post("/login", (req, res) => {
  res.send("Login logic");
});

router.get("/register", (req, res) => {
  res.render("register", { errors: [] });
});

router.post("/register", (req, res) => {
  res.send("Register logic");
});

router.get("/logout", (req, res) => {
  res.send("Logout logic");
});

module.exports = router;