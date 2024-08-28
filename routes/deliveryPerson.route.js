const express = require("express");
const router = express.Router();
const {
  getDeliveryPersons,
  createDeliveryPerson,
  deleteDeliveryPerson,
  getDeliveryPersonById,
  updateDeliveryPerson,
  getDeliveryPersonName,
} = require("../controllers/deliveryPerson.controllers");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_deliveries"),
  getDeliveryPersons
);
router.get(
  "/name",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_deliveries"),
  getDeliveryPersonName
);
router.get(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_deliveries"),
  getDeliveryPersonById
);
router.post(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "create_deliveries"),
  createDeliveryPerson
);
router.put(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "update_deliveries"),
  updateDeliveryPerson
);
router.delete(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "delete_deliveries"),
  deleteDeliveryPerson
);

module.exports = router;
