const express = require("express");
const router = express.Router();
const {
  getRoles,
  createRole,
  deleteRole,
  getRole,
  updateRole,
} = require("../controllers/role.controllers.js");

router.get("/", getRoles);
router.get("/:id", getRole);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

module.exports = router;
