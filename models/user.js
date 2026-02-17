const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/miniproject");

const userSchema = new mongoose.Schema({
  username: String,
  age: Number,
  name: String,
  email: String,
  password: String,
  profilepic: {
    type: String,
    default: "default.jpg",
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
});
module.exports = mongoose.model("User", userSchema);
