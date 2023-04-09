const { User } = require("../models");

const getFavorites = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json({
        message: "Favorites retrieved.",
        favorites: JSON.parse(user.favorites),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editFavorites = async (req, res) => {
  const id = req.params.id;
  // const { firstName, lastName } = req.body;

  try {
    const user = await User.findByPk(id);
    if (user) {
      user.favorites = req.body.favorites;
      await user.validate();
      const success = await user.save();

      if (success) {
        return res.status(200).json({
          message: "Favorites updated successfully.",
          favorites: user.favorites,
        });
      }
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user" });
  }
};
const addFavorite = async (req, res) => {
  const id = req.params.id;
  // const { firstName, lastName } = req.body;

  const user = await User.findByPk(id);
  if (user) {
    const oldFavorites = user.favorites;
    const newFav = req.body.favorites;
    if (oldFavorites.includes(newFav)) {
      return res.status(201).json({
        message: "User already a favorite.",
        favorites: oldFavorites,
      });
    }
    const newFavorites = [
      ...oldFavorites,
      JSON.parse(req.body.favorite),
    ].sort();

    try {
      user.favorites = newFavorites;
      await user.validate();
      await user.save().then(() => {
        return res.status(200).json({
          message: "Favorite added successfully.",
          favorites: user.favorites,
        });
      });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        // Handle validation errors here
        return res
          .status(404)
          .json({ message: "Not possible to favorite user." });
      } else {
        // Handle other errors here
        return res.status(500).json({ message: "Error updating user" });
      }
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};
const removeFavorite = async (req, res) => {
  const id = req.params.id;
  // const { firstName, lastName } = req.body;

  const user = await User.findByPk(id);
  if (user) {
    const oldFavorites = user.favorites;
    const newFav = req.body.favorites;

    if (!oldFavorites.includes(newFav)) {
      return res.status(201).json({
        message: "User not a favorite.",
        favorites: oldFavorites,
      });
    }

    const newFavorites = oldFavorites.filter((oldfav) => oldfav !== newFav);
    console.log(oldFavorites);
    console.log(newFavorites);

    try {
      user.favorites = [...newFavorites];
      // await user.validate();
      await user.save({ validate: false }).then(() => {
        console.log("SAVEDDDDD");
        return res.status(200).json({
          message: "Favorite removed successfully.",
          favorites: user.favorites,
        });
      });
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        // Handle validation errors here
        console.log(err);
        return res
          .status(404)
          .json({ message: "Not possible to favorite user." });
      } else {
        // Handle other errors here
        return res.status(500).json({ message: "Error updating user" });
      }
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  getFavorites,
  editFavorites,
  addFavorite,
  removeFavorite,
};
