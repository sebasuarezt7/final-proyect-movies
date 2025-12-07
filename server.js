// Testing branch functionality - Sebastian
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const helmet = require("helmet");

const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

// SESSIONS (ONLY ONCE)
app.use(
  session({
    secret: "supersecretkey123",
    resave: false,
    saveUninitialized: false,
  })
);

// MAKE currentUser AVAILABLE IN ALL EJS FILES
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ROUTES
app.use("/", authRoutes);
app.use("/movies", movieRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);