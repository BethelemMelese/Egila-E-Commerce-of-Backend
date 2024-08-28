const express = require("express");
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  deleteAdmin,
  getAdminById,
  updateAdmin,
} = require("../controllers/admin.controllers.js");

router.get("/", getAdmins);
router.get("/:id", getAdminById);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
