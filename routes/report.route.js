const express = require("express");
const router = express.Router();
const {
  generateReport
} = require("../controllers/report.controllers");
const { verificationToken } = require("../controllers/user.controllers.js");

router.post("/generateReport/", verificationToken, generateReport);

module.exports = router;
