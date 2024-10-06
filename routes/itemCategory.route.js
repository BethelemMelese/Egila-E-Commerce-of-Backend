const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  getItemCategorys,
  getItemCategoryNames,
  createItemCategory,
  deleteItemCategory,
  getItemCategoryById,
  updateItemCategory,
  uploadCategoryImage,
  downloadFile,
} = require("../controllers/itemCategory.controllers");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "category-images",
    format: async (req, file) => "jpg" || "png" || "jpeg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_category"),
  rbacMiddleware.checkRole("Delivery Person"),
  rbacMiddleware.checkPermission("Delivery Person", "read_item"),
  getItemCategorys
);
router.get("/names", getItemCategoryNames);
router.get(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_category"),
  getItemCategoryById
);
router.post(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "create_category"),
  upload.single("file"),
  createItemCategory
);
router.put(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "update_category"),
  upload.single("file"),
  updateItemCategory
);
router.delete(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "delete_category"),
  deleteItemCategory
);
// The upload.single('file') middleware is used to handle the file upload
router.post(
  "/uploads",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "create_category"),
  upload.single("file"),
  uploadCategoryImage
);
router.get("/uploads/:filePath", downloadFile);

module.exports = router;
