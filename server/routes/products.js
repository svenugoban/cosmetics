const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

router.get("/cosmeticAll", getProducts);
router.get("/cosmetic/:id", getProductById);
router.post("/cosmetic", createProduct);
router.put("/cosmetic/:id", updateProduct);
router.delete("/cosmetic/:id", deleteProduct);

module.exports = router;
