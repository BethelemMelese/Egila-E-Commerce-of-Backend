const express = require("express");
const multer = require("multer");

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
  updatePassword,
  deleteUser,
  createUser,
  updateUser,
  updateProfile,
  updateProfileImage,
  downloadPhoto,
  getUserByToken
} = require("../controllers/user.controllers.js");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

router.get("/", getUsers);
router.get("/:id", getUser);
router.get("/", getUserByUserName);
router.get("/roleId/:id", getUserByRoleId);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/generateToken", generateToken);
router.post("/validateToken", verificationToken);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/changePassword/:id", updatePassword);
router.put("/profile/:id", upload.single("file"), updateProfile);
router.get("/uploads/:filePath", downloadPhoto);
router.get("/UserInfo/:token",getUserByToken);
router.put("/updateProfile/:id", updateProfile);

module.exports = router;
