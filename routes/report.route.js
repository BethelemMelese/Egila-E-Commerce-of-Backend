const express = require("express");
const router = express.Router();
const {
  getItemName,
  getItemCategory,
} = require("../controllers/report.controllers");
const { verificationToken } = require("../controllers/user.controllers.js");

router.get("/itemName", verificationToken, getItemName);
router.get("/itemCategory", verificationToken, getItemCategory);

module.exports = router;
