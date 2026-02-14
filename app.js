const express = require("express");
const app = express();
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  //   console.log("hey");
  res.render("index");
});

app.post("/register", async (req, res) => {
  let { name, age, email, password, username } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("user already exists");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        name,
        age,
        email,
        password: hash,
        username,
      });
    });
  });
});
app.listen(3000);
