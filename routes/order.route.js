const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  createOrder,
  assignDeliveryPerson,
  updateOrderStatus,
  getOrder,
  deleteOrder,
} = require("../controllers/order.controller.js");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

router.post("/", upload.single("file"), createOrder);
router.put(
  "/assignDeliveryPerson/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "update_order"),
  assignDeliveryPerson
);
router.put(
  "/orderStatus/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "update_order"),
  updateOrderStatus
);
router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_order"),
  getOrder
);
router.delete(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Admin", "read_order"),
  deleteOrder
);

module.exports = router;
