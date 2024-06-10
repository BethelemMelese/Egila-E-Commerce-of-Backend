const express = require("express");
const router = express.Router();
const {
  getRoles,
  createRole,
  deleteRole,
  getRole,
  updateRole,
} = require("../controllers/role.controllers.js");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Customer"),
  rbacMiddleware.checkPermission("Customer", "read_role"),
  getRoles
);
router.get(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Customer"),
  rbacMiddleware.checkPermission("Customer", "read_role"),
  getRole
);
router.post(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Customer"),
  rbacMiddleware.checkPermission("Customer", "create_role"),
  createRole
);
router.put(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Customer"),
  rbacMiddleware.checkPermission("Customer", "update_role"),
  updateRole
);
router.delete(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Customer"),
  rbacMiddleware.checkPermission("Customer", "delete_role"),
  deleteRole
);

module.exports = router;
