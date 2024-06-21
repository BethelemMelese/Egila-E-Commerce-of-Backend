const express = require("express");
const router = express.Router();
const {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controllers.js");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.get("/", verificationToken, getComments);
router.get("/:id", verificationToken, getComment);
router.post("/", verificationToken, createComment);
router.put("/:id", verificationToken, updateComment);
router.delete("/:id", verificationToken, deleteComment);

module.exports = router;
