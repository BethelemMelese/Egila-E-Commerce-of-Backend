const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  getItemCategorys,
  createItemCategory,
  deleteItemCategory,
  getItemCategory,
  updateItemCategory,
  uploadCategoryImage,
} = require("../controllers/itemCategory.controllers");

const uploads = multer({ dest: __dirname + "/uploads" });

// var storage = multer.diskStorage({
//   destination: (file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (file, cb) => {
//     cb(null, file.filename + "-" + Date.now());
//   },
// });

// const upload=multer({storage:storage});

router.get("/", getItemCategorys);
router.get("/:id", getItemCategory);
router.post("/", createItemCategory);
router.put("/:id", updateItemCategory);
router.delete("/:id", deleteItemCategory);
router.post("/uploads", uploads.array("categoryImage"), uploadCategoryImage);

module.exports = router;
