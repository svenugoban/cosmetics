const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/cosmeticAll", getProducts);
router.get("/cosmetic/:id", getProductById);
router.post("/cosmetic", upload.single("image"), createProduct);
router.put("/cosmetic/:id", upload.single("image"), updateProduct);
router.delete("/cosmetic/:id", deleteProduct);

module.exports = router;
