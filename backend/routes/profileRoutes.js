const express = require("express");
const { authenticateToken } = require("../utils");
const router = express.Router();
const {
  getProfiles,
  getProfile,
  createUser,
  editProfile,
  deleteProfile,
} = require("../controllers/profiles");

router.get("/", authenticateToken, getProfiles);
router.get("/:id", authenticateToken, getProfile);
router.post("/", createUser);
router.put("/:id", authenticateToken, editProfile);
router.delete("/:id", authenticateToken, deleteProfile);

module.exports = router;
