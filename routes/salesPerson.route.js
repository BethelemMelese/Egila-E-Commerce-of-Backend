const express = require("express");
const router = express.Router();
const {
  getSalesPersons,
  createSalesPerson,
  deleteSalesPerson,
  getSalesPersonById,
  updateSalesPerson,
} = require("../controllers/salesPerson.controllers");

router.get("/", getSalesPersons);
router.get("/:id", getSalesPersonById);
router.post("/", createSalesPerson);
router.put("/:id", updateSalesPerson);
router.delete("/:id", deleteSalesPerson);

module.exports = router;
