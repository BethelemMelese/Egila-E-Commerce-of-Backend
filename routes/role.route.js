const express = require("express");
const router = express.Router();
const {
  getRoles,
  createRole,
  deleteRole,
  getRole,
  updateRole,
  searchAndFilterRole
} = require("../controllers/role.controllers.js");

router.get("/", getRoles);
router.get("/:id", getRole);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
// router.get("/", searchAndFilterRole);


module.exports = router;
