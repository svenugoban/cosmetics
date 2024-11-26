const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const Product = require("../models/productsModel");

jest.mock("../models/productsModel");

jest.mock("../config/db", () => ({
  getConnection: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue([]), // Mock query function
    release: jest.fn(), // Mock release function
  }),
}));

describe("Products Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should return a list of products", async () => {
      const req = { query: { page: 1, limit: 10 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockProducts = [{ id: 1, name: "Product 1" }];
      Product.findAll.mockResolvedValue(mockProducts);

      await getProducts(req, res);

      expect(Product.findAll).toHaveBeenCalledWith(10, 0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should return a 500 error if an exception occurs", async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Product.findAll.mockRejectedValue(new Error("Database error"));

      await getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving products" });
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockProduct = { id: 1, name: "Product 1" };
      Product.findById.mockResolvedValue(mockProduct);

      await getProductById(req, res);

      expect(Product.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it("should return a 404 if the product is not found", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Product.findById.mockResolvedValue(null);

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Product not found" });
    });

    it("should return a 500 error if an exception occurs", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Product.findById.mockRejectedValue(new Error("Database error"));

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error retrieving product" });
    });
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const req = {
        body: {
          name: "Product 1",
          price: 100,
          category: "Category 1",
          description: "Desc",
          usages: "Usage",
          image_url: "image.jpg",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockProduct = { id: 1, ...req.body };
      Product.create.mockResolvedValue(mockProduct);

      await createProduct(req, res);

      expect(Product.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product created successfully",
        product: mockProduct,
      });
    });

    it("should return a 400 error for invalid input", async () => {
      const req = { body: { price: 100 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Name is required and must be a string" });
    });
  });

  describe("updateProduct", () => {
    it("should update a product", async () => {
      const req = {
        params: { id: "1" },
        body: { name: "Updated Product", price: 150 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockProduct = { id: 1, ...req.body };
      Product.update.mockResolvedValue(mockProduct);

      await updateProduct(req, res);

      expect(Product.update).toHaveBeenCalledWith("1", req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product updated successfully",
        product: mockProduct,
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Product.delete.mockResolvedValue(true);

      await deleteProduct(req, res);

      expect(Product.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Product deleted successfully", product: true });
    });

    it("should return a 404 error if the product is not found", async () => {
      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Product.delete.mockResolvedValue(false);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Product not found" });
    });
  });
});
