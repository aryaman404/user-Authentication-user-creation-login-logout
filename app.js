const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/create", (req, res) => {
  let { username, email, password, age } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createuser = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });
      let token = jwt.sign({ email: email }, "shsshshs");
      res.cookie("token", token);
      res.send(createuser);
    });
  });
});

app.get("/logout", (req, res) => {
  // in real life we do Post method to logout user
  res.cookie("token", "");
  res.redirect("/");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.send("something is wrong");

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    console.log(result);
  });
});

app.listen(3000, () => {
  console.log("server is running");
});
