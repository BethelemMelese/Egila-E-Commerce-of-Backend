const express = require("express");
const router = express.Router();
const {
  getSalesPersons,
  createSalesPerson,
  deleteSalesPerson,
  getSalesPersonById,
  updateSalesPerson,
} = require("../controllers/salesPerson.controllers");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Admin"),
  rbacMiddleware.checkPermission("Admin", "read_salesPerson"),
  getSalesPersons
);
router.get(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Admin"),
  rbacMiddleware.checkPermission("Admin", "read_salesPerson"),
  getSalesPersonById
);
router.post(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Admin"),
  rbacMiddleware.checkPermission("Admin", "create_salesPerson"),
  createSalesPerson
);
router.put(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Admin"),
  rbacMiddleware.checkPermission("Admin", "update_salesPerson"),
  updateSalesPerson
);
router.delete(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Admin"),
  rbacMiddleware.checkPermission("Admin", "delete_salesPerson"),
  deleteSalesPerson
);

module.exports = router;
