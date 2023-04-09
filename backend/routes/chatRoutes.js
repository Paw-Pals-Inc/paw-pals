const express = require("express");
const { authenticateToken } = require("../utils");
const router = express.Router();
const {
  getMessages,
  getAllMessages,
  postMessages,
  postMessage,
  deleteMessages,
} = require("../controllers/chats");

router.get("/", authenticateToken, getAllMessages);
router.get("/:userId1/:userId2", authenticateToken, getMessages);
router.post("/bulk", authenticateToken, postMessages);
router.post("/", authenticateToken, postMessage);
router.delete("/:userId1/:userId2", authenticateToken, deleteMessages);

module.exports = router;
