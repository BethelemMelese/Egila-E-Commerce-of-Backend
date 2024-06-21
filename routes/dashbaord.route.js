const express = require("express");
const router = express.Router();
const {
  getCountCustomer,
  getCountDeliveries,
  getCountSalesPerson,
  getCountOrders,
  getRecentOrder,
  getSalesList,
  getCurrentCategory,
  getCurrentItem,
  getCurrentCustomerOrder,
  getCurrentNewArrivalItems
} = require("../controllers/dashboardControllers.js");
const { verificationToken } = require("../controllers/user.controllers.js");

router.get("/countCustomer", verificationToken, getCountCustomer);
router.get("/countDeliveries", verificationToken, getCountDeliveries);
router.get("/countSalesPerson", verificationToken, getCountSalesPerson);
router.get("/countOrders", verificationToken, getCountOrders);
router.get("/recentOrder", verificationToken, getRecentOrder);
router.get("/salesList", verificationToken, getSalesList);
router.get("/currentCategories", verificationToken, getCurrentCategory);
router.get("/currentItems", verificationToken, getCurrentItem);
router.get("/currentOrder", verificationToken, getCurrentCustomerOrder);
router.get("/currentNewArrival", verificationToken, getCurrentNewArrivalItems);


module.exports = router;
