const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// GET all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.render("showMovies", { movies });
});

// FORM: Add movie
router.get("/add", (req, res) => {
  res.render("addMovie", { errors: [] });
});

// POST: Add movie
router.post("/add", async (req, res) => {
  res.send("Add movie functionality goes here");
});

// Movie details
router.get("/:id", async (req, res) => {
  res.send("Movie details page");
});

// Edit movie
router.get("/edit/:id", async (req, res) => {
  res.send("Edit form goes here");
});

router.post("/edit/:id", async (req, res) => {
  res.send("Handle edit logic");
});

// Delete movie
router.post("/delete/:id", async (req, res) => {
  res.send("Delete logic here");
});

module.exports = router;