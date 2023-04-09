const express = require("express");
const { authenticateToken } = require("../utils");
const router = express.Router();
const {
  getFavorites,
  editFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favorites");

router.get("/:id", authenticateToken, getFavorites);
router.put("/:id", authenticateToken, editFavorites);
router.put("/add/:id", authenticateToken, addFavorite);
router.put("/remove/:id", authenticateToken, removeFavorite);

module.exports = router;
