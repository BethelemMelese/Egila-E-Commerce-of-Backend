const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  getUserByUserName,
  getUserByRoleId,
  loginUser,
  logOutUser,
  generateToken,
  verificationToken,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/user.controllers.js");

router.get("/", getUsers);
router.get("/:id", getUser);
router.get("/", getUserByUserName);
router.get("/roleId/:id",getUserByRoleId);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/generateToken", generateToken);
router.post("/validateToken", verificationToken);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
