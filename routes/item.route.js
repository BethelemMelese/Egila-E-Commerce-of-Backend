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
router.get(
  "/",
  verificationToken,
  rbacMiddleware.checkRole("Sales Person"),
  rbacMiddleware.checkPermission("Sales Person", "read_item"),
  getItems
);
router.get(
  "/search/",
  getItemBySearch
);
router.get("/newArrival/", getNewArrivalItems);
router.get(
  "/categoryId/:categoryId",
  getItemByCategoryId
);
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
