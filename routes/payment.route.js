const express = require("express");
const router = express.Router();
const {
  getPaymentByOrderId,
  downloadFile
} = require("../controllers/payment.controllers.js");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.get(
  "/:orderId",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_order"),
  getPaymentByOrderId
);
router.get("/uploads/:filePath", downloadFile);

module.exports = router;
