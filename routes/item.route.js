const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  createItem,
  deleteItem,
  getItemById,
  getItemByCategoryId,
  getItems,
  getNewArrivalItems,
  updateItem,
  downloadFile,
  filterItemByCategoryIdAndSearch,
} = require("../controllers/item.controllers");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });
router.get("/", getItems);
router.get("/newArrival/", getNewArrivalItems);
// router.get("/:id", getItemById);
router.get("/categoryId/:categoryId", getItemByCategoryId);
router.get("/categorySearch/", filterItemByCategoryIdAndSearch);
router.post("/", upload.single("file"), createItem);
router.put("/:id", upload.single("file"), updateItem);
router.delete("/:id", deleteItem);
router.get("/uploads/:filePath", downloadFile);

module.exports = router;
