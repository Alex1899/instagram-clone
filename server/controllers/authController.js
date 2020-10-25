const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { create } = require("../model/userSchema");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "", fullname: "", username: "" };

  // duplicate error code
  if (err.code === 11000) {
    Object.keys(err.keyValue).forEach((key) => {
      let message;
      if (key === "email") {
        message = "User with this email already exists";
      }

      if (key === "username") {
        message = "User with this username already exists";
      }

      errors[key] = message;
    });
  }

  // validation errros
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes("duplicate key error")) {
  }

  return errors;
};

const maxAge = 3*24*60*60;

const createToken = (id) => {
  return jwt.sign({ id }, 'ajfhakjbfnal1931ou424ljanl', {
    expiresIn: maxAge
  })
}

module.exports.register_user = async function (req, res, next) {
  console.log("Post data =>", req.body);
  const userData = req.body;

  try {
    // if (userData.password !== userData.passwordCheck)
    //   return res.status(400).send({ msg: "Passwords do not match." });

    const user = await User.create(userData);
    const token = create(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
    res.send({ user: user.username });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_user = async function (req, res, next) {
  const userData = req.body;
  console.log(userData);

  const user = await User.findOne({ username: userData.username });
  console.log(user);

  if (!user)
    return res.status(400).send({ msg: "User not found with these details" });

  const match = bcrypt.compare(userData.password, user.password);
  if (!match)
    return res.status(400).send({ msg: "Incorrect password for this user" });

  res.send({ username: user.username, userId: user._id });
};
