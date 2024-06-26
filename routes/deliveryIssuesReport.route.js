const express = require("express");
const router = express.Router();
const {
  addIssueReport,
  getIssueReport,
} = require("../controllers/deliveryIssuesReport.controllers.js");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.post(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Delivery Person"),
  rbacMiddleware.checkPermission("Delivery Person", "create_issueReport"),
  addIssueReport
);
router.get(
  "/:orderId",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_issuesReport"),
  getIssueReport
);

module.exports = router;
