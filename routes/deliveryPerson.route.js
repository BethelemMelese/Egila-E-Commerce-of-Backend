const express = require("express");
const router = express.Router();
const {
  getDeliveryPersons,
  createDeliveryPerson,
  deleteDeliveryPerson,
  getDeliveryPersonById,
  updateDeliveryPerson,
} = require("../controllers/deliveryPerson.controllers");

router.get("/", getDeliveryPersons);
router.get("/:id", getDeliveryPersonById);
router.post("/", createDeliveryPerson);
router.put("/:id", updateDeliveryPerson);
router.delete("/:id", deleteDeliveryPerson);

module.exports = router;
