const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  year: Number,
  genres: [String],
  rating: Number,
  createdBy: String
})
module.exports = mongoose.model("Movie", MovieSchema);