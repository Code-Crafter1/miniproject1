const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  //   console.log("hey");
  res.render("index");
});

app.get("/login", (req, res) => {
  //   console.log("hey");
  res.render("login");
});

app.get("/profile", isloggedIn, async (req, res) => {
  //   console.log(req.user);
  let user = await userModel.findOne({ email: req.user.email });
  console.log(user);

  res.render("profile", { user });
});

app.post("/register", async (req, res) => {
  let { name, age, email, password, username } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("user already registered");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        name,
        age,
        email,
        password: hash,
        username,
      });
      let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
      res.cookie("token", token);
      res.send("user created");
    });
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("something went wrong");
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
      res.cookie("token", token);
      res.status(200).redirect("/profile");
    } else res.redirect("/login");
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

//middleware for protected routes

function isloggedIn(req, res, next) {
  if (!req.cookies.token) {
    //  covers all the cases undefined, null, empty string
    return res.redirect("/login");
  } else {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    next();
  }
}

app.listen(3000);
