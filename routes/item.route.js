const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  createItem,
  deleteItem,
  getItemBySearch,
  getItemByCategoryId,
  getItems,
  getNewArrivalItems,
  updateItem,
  downloadFile,
  filterItemByCategoryIdAndSearch,
} = require("../controllers/item.controllers");
const { verificationToken } = require("../controllers/user.controllers.js");
const rbacMiddleware = require("../middleware/rbacMIddleware.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "item-images",
    format: async (req, file) => "jpg" || "png" || "jpeg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_item"),
  rbacMiddleware.checkRole("Delivery Person"),
  rbacMiddleware.checkPermission("Delivery Person", "read_item"),
  getItems
);
router.get("/search/", getItemBySearch);
router.get("/newArrival/", getNewArrivalItems);
router.get("/categoryId/:categoryId", getItemByCategoryId);
router.get("/categorySearch/", filterItemByCategoryIdAndSearch);
router.post(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "create_item"),
  upload.single("file"),
  createItem
);
router.put(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "update_item"),
  upload.single("file"),
  updateItem
);
router.delete(
  "/:id",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "delete_item"),
  deleteItem
);
router.get("/uploads/:filePath", downloadFile);

module.exports = router;
