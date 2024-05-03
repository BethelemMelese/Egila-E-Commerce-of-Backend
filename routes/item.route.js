const express = require("express");
const router = express.Router();
const {
  createItem,
  deleteItem,
  getItem,
  getItemByCategoryId,
  getItems,
  updateItem,
} = require("../controllers/item.controllers");

router.get("/", getItems);
router.get("/:id", getItem);
router.get("/:categoryId", getItemByCategoryId);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
