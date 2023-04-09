const { User, Profile } = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils");

// create user account and attached blank profile
const createUser = async (req, res) => {
  try {
    // generate salt and hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user record
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      favorites: req.body?.favorites,
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Error: Already an account with that email address" });
    }

    const profile = await Profile.create({ userID: user.id });

    // Send a response with the newly created user and profile records
    const accessToken = generateAccessToken(user);
    res.status(201).json({
      message: "User created successfully",
      token: accessToken,
      user: user,
      profile: profile,
    });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ message: "Email already taken" });
  }
};

// read
const getProfile = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await Profile.findOne({ where: { userId: id } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update
const editProfile = async (req, res) => {
  console.log("updating profile");
  const id = req.params.id;
  // const { firstName, lastName } = req.body;

  try {
    const [updated] = await Profile.update(req.body, {
      where: { userId: id },
    });

    if (updated) {
      const user = await Profile.findOne({ where: { userId: id } });
      return res.status(200).json(user);
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user" });
  }
};

// delete
const deleteProfile = async (req, res) => {
  const profileId = req.params.id;

  Profile.destroy({
    where: { userId: profileId },
  })
    .then(() => {
      res.status(200).json({
        message: `Profile with userId ${profileId} has been deleted.`,
      });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the profile." });
    });
};

// readAll
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while getting the profiles." });
  }
};

module.exports = {
  getProfiles,
  getProfile,
  createUser,
  editProfile,
  deleteProfile,
};
