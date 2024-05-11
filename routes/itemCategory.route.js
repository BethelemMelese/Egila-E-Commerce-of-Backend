const express = require("express");
const router = express.Router();
const {
  getItemCategorys,
  createItemCategory,
  deleteItemCategory,
  getItemCategory,
  updateItemCategory,
} = require("../controllers/itemCategory.controllers");

router.get("/", getItemCategorys);
router.get("/:id", getItemCategory);
router.post("/", createItemCategory);
router.put("/:id", updateItemCategory);
router.delete("/:id", deleteItemCategory);

module.exports = router;
