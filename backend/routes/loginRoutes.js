const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utils");
const { postLogin, postCheckToken } = require("../controllers/login");

router.post("/", postLogin);
router.post("/checkTokenValidity", authenticateToken, postCheckToken);

module.exports = router;
