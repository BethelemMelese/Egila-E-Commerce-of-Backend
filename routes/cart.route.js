const express = require("express");
const router = express.Router();
const {
  createCart,
  deleteCart,
  updateCart,
  getCartCounter,
  getCart,
  getCartList,
} = require("../controllers/cart.controllers.js");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");

router.post("/", createCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);
router.get("/count/:uuId", getCartCounter);
router.get("/viewCart/:uuId", getCart);
router.post(
  "/viewCartList/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_cart"),
  getCartList
);

module.exports = router;
