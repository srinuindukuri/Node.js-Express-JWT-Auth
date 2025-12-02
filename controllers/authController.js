// controller actions
const User = require("../models/User");
const jwt = require("jsonwebtoken");
//handle Errors
const HandleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // Email Error
  if (err.message === "incorrect email") {
    errors.email = "The email is not registered...";
  }

  // Password Error
  if (err.message === "incorrect password") {
    errors.password = "The password is incorrect...";
  }

  ///Duplicate Email Error
  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  //Validation ERRORS
  if (err.message.includes("user validation failed")) {
    ///console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      //console.log(val);
      //console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

//controller actions
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = HandleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = HandleErrors(err);
    res.status(400).json({ errors });
  }
};

// Logging users OUT, checks for jwt.
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
