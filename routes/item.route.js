const express = require("express");
const router = express.Router();
const {
  createItem,
  deleteItem,
  getItemById,
  getItemByCategoryId,
  getItems,
  updateItem,
} = require("../controllers/item.controllers");

router.get("/", getItems);
router.get("/:id", getItemById);
router.get("/categoryId/:categoryId", getItemByCategoryId);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
