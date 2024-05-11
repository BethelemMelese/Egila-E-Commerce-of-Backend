const express = require("express");
const router = express.Router();
const {
  getUserProfiles,
  getUserProfileById,
  deleteUserProfile,
  createUserProfile,
  updateUserProfile,
} = require("../controllers/userProfile.controller");

router.get("/", getUserProfiles);
router.get("/:id", getUserProfileById);
router.post("/", createUserProfile);
router.put("/:id", updateUserProfile);
router.delete("/:id", deleteUserProfile);

module.exports = router;
