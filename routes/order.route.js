const express = require("express");
const multer = require("multer");

const router = express.Router();
const {
  createOrder,
  getOrder,
  deleteOrder,
} = require("../controllers/order.controller.js");

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

router.post("/", upload.single("file"), createOrder);
router.get("/", getOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
