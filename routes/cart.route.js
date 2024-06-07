const express = require("express");
const router = express.Router();
const {
  createCart,
  deleteCart,
  updateCart,
  getCartCounter,
  getCart
} = require("../controllers/cart.controllers.js");

router.post("/", createCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);
router.get("/count/:uuId", getCartCounter);
router.get("/viewCart/:uuId",getCart);

module.exports = router;
