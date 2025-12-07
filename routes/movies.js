const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const requireLogin = require("../middleware/requireLogin");

// =============================
// SHOW ALL MOVIES
// =============================
router.get("/", async (req, res) => {
  const search = req.query.search || "";

  const movies = await Movie.find({
    name: { $regex: search, $options: "i" }
  });

  res.render("showMovies", { movies, search });
});

// =============================
// ADD MOVIE (PROTECTED)
// =============================

// GET Add movie form
router.get("/add", requireLogin, (req, res) => {
  res.render("addMovie", { errors: [], oldData: {} });
});

// POST Add movie
router.post("/add", requireLogin, async (req, res) => {
  const { name, description, year, genres, rating } = req.body;
  const errors = [];

  // Validations
  if (!name || name.trim() === "") errors.push("Name is required.");
  if (!description || description.trim() === "") errors.push("Description is required.");
  if (!year || isNaN(year)) errors.push("Year must be a number.");
  if (!rating || rating < 1 || rating > 10) errors.push("Rating must be between 1 and 10.");

  if (errors.length > 0) {
    return res.render("addMovie", { errors, oldData: req.body });
  }

  await Movie.create({
    name,
    description,
    year,
    genres: genres.split(",").map(g => g.trim()),
    rating,
    createdBy: req.session.user._id
  });

  res.redirect("/movies");
});

// =============================
// EDIT MOVIE (PROTECTED + OWNER ONLY)
// =============================

// GET Edit movie form
router.get("/edit/:id", requireLogin, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.send("Movie not found");

  if (movie.createdBy != req.session.user._id) {
    return res.send("You are not allowed to edit this movie.");
  }

  res.render("editMovie", { movie, errors: [] });
});

// POST Edit movie
router.post("/edit/:id", requireLogin, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.send("Movie not found");

  if (movie.createdBy != req.session.user._id) {
    return res.send("You cannot edit a movie you did not create.");
  }

  const { name, description, year, genres, rating } = req.body;
  const errors = [];

  // Validations
  if (!name || name.trim() === "") errors.push("Name is required.");
  if (!description || description.trim() === "") errors.push("Description is required.");
  if (!year || isNaN(year)) errors.push("Year must be a number.");
  if (!rating || rating < 1 || rating > 10) errors.push("Rating must be between 1 and 10.");

  if (errors.length > 0) {
    return res.render("editMovie", { movie, errors });
  }

  await Movie.findByIdAndUpdate(req.params.id, {
    name,
    description,
    year,
    genres: genres.split(",").map(g => g.trim()),
    rating
  });

  res.redirect("/movies/" + req.params.id);
});

// =============================
// DELETE MOVIE (PROTECTED + OWNER ONLY)
// =============================
router.post("/delete/:id", requireLogin, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.send("Movie not found");

  if (movie.createdBy != req.session.user._id) {
    return res.send("You cannot delete a movie you did not create.");
  }

  await Movie.findByIdAndDelete(req.params.id);

  res.redirect("/movies");
});

// =============================
// MOVIE DETAILS (MUST BE LAST)
// =============================
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.send("Movie not found");

  res.render("movieDetails", { movie });
});

module.exports = router;