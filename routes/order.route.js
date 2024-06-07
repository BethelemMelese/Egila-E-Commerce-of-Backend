const express = require("express");
const router = express.Router();
const { createOrder, getOrder } = require("../controllers/order.controller.js");

router.post("/", createOrder);
router.get("/", getOrder);

module.exports = router;
