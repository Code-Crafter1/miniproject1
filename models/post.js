const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/miniproject");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
module.exports = mongoose.model("post", postSchema);
