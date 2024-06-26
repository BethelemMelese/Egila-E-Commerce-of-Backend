const express = require("express");
const router = express.Router();
const {
  getCustomers,
  createCustomer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} = require("../controllers/customer.controllers.js");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkRole("Admin"),
  rbacMiddleware.checkPermission("Sales Person", "read_customer"),
  rbacMiddleware.checkPermission("Admin", "read_customer"),
  getCustomers
);

router.get(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_customer"),
  getCustomerById
);

router.post(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "create_customer"),
  createCustomer
);

router.put(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "update_customer"),
  updateCustomer
);

router.delete(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "delete_customer"),
  deleteCustomer
);

module.exports = router;
