const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieparser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
require("dotenv").config();
const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieparser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://srinuindukuri2001:tgvXiC76pT6uWf1I@backenddb.96wzfju.mongodb.net/BackEndDB";
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.log(err));
// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

//cookies
//app.get("/set-cookies", (req, res) => {
// res.send('Set-Cookie, 'newUser=true');

//Below is written by using third-party package cookie-parser,,,
//res.cookie("newUser", false);
//res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24 });

//res.send("you got the cookies");
//});

//app.get("/read-cookies", (req, res) => {
//const cookies = req.cookies;
//console.log(cookies);

//res.json(cookies);
//});
