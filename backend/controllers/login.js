const { User } = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils");

const postLogin = async (req, res) => {
  try {
    // query database for user with matching email
    const user = await User.findOne({ where: { email: req.body.email } });

    // check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    res
      .status(200)
      .json({ message: "Login successful", token: accessToken, user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postCheckToken = async (req, res) => {
  res.status(200).json({
    isValid: true,
    message: "Protected endpoint accessed successfully",
  });
};

module.exports = { postLogin, postCheckToken };
