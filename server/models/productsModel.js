const pool = require("../config/db"); // Import the pool

class Product {
  static async findAll(limit, offset) {
    const [rows] = await pool.query("SELECT * FROM products LIMIT ? OFFSET ?", [limit, offset]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(data) {
    const { name, price, category, description, usages, image_url } = data;

    const [result] = await pool.query(
      "INSERT INTO products (name, price, category, description, usages, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [name, price, category, description, usages, image_url]
    );

    return {
      id: result.insertId,
      name,
      price,
      category,
      description,
      usages,
      image_url,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  static async update(id, data) {
    const { name, price, category, description, usages, image_url } = data;

    await pool.query(
      "UPDATE products SET name = ?, price = ?, category = ?, description = ?, usages = ?, image_url = ?, updated_at = NOW() WHERE id = ?",
      [name, price, category, description, usages, image_url, id]
    );

    return {
      id,
      name,
      price,
      category,
      description,
      usages,
      image_url,
      updated_at: new Date(),
    };
  }

  static async delete(id) {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return null; // Product not found
    }

    return { id };
  }
}

module.exports = Product;
