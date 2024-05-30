const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  getItemCategorys,
  createItemCategory,
  deleteItemCategory,
  getItemCategoryById,
  updateItemCategory,
  uploadCategoryImage,
  downloadFile,
} = require("../controllers/itemCategory.controllers");

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
router.get("/", getItemCategorys);
router.get("/:id", getItemCategoryById);
router.post("/", upload.single("file"), createItemCategory);
router.put("/:id", upload.single("file"), updateItemCategory);
router.delete("/:id", deleteItemCategory);
// The upload.single('file') middleware is used to handle the file upload
router.post("/uploads", upload.single("file"), uploadCategoryImage);
router.get("/uploads/:filePath", downloadFile);

module.exports = router;
