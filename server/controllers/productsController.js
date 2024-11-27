const Product = require("../models/productsModel");

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const products = await Product.findAll(Number(limit), Number(offset));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Error retrieving products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Error retrieving product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, usages } = req.body;

    // Check if a file was uploaded
    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required and must be a string" });
    }

    // Create the product
    const newProduct = await Product.create({
      name,
      price,
      category,
      description,
      usages,
      image_url: imageUrl,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, usages } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    // Check if a file was uploaded
    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : undefined; // Undefined to ignore if no file was uploaded

    // Validate fields if provided
    if (name && typeof name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    // Update the product
    const updatedFields = {
      name,
      price,
      category,
      description,
      usages,
      ...(imageUrl && { image_url: imageUrl }), // Only include image_url if a new file was uploaded
    };

    const updatedProduct = await Product.update(id, updatedFields);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    const deleted = await Product.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product: deleted });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
