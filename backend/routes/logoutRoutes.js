const express = require("express");
const router = express.Router();
const postLogout = require("../controllers/logout");

router.post("/", postLogout);

module.exports = router;
