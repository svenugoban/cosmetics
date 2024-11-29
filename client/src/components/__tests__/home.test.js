import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import ProductList from "../product/productList/product-list";

// Mock Axios
jest.mock("axios");

describe("ProductList Component CRUD Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state initially", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <ProductList />
      </Router>
    );

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  it("should display products after fetching", async () => {
    const mockProducts = [
      { id: 1, name: "Lipstick", price: 20, category: "Cosmetics", image_url: "lipstick.jpg" },
      { id: 2, name: "Foundation", price: 30, category: "Cosmetics", image_url: "foundation.jpg" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockProducts });

    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Verify products are displayed
    expect(screen.getByText("Lipstick")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("Foundation")).toBeInTheDocument();
    expect(screen.getByText("$30")).toBeInTheDocument();
  });

  it("should display an error if fetching products fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Error fetching products. Please try again.")).toBeInTheDocument();
  });

  it("should open the create product dialog when clicking 'Create Cosmetic'", () => {
    render(
      <Router>
        <ProductList />
      </Router>
    );

    const createButton = screen.getByText("Create Cosmetic");
    fireEvent.click(createButton);

    expect(screen.getByText("Create Cosmetic")).toBeInTheDocument();
  });

  it("should handle product creation", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 3, name: "Mascara", price: 15, category: "Cosmetics" } });
    const mockProducts = [{ id: 1, name: "Lipstick", price: 20, category: "Cosmetics", image_url: "lipstick.jpg" }];
    axios.get.mockResolvedValueOnce({ data: mockProducts });

    render(
      <Router>
        <ProductList />
      </Router>
    );

    const createButton = screen.getByText("Create Cosmetic");
    fireEvent.click(createButton);

    const nameInput = screen.getByLabelText("Name");
    const priceInput = screen.getByLabelText("Price");
    const categoryInput = screen.getByLabelText("Category");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(nameInput, { target: { value: "Mascara" } });
    fireEvent.change(priceInput, { target: { value: 15 } });
    fireEvent.change(categoryInput, { target: { value: "Cosmetics" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(
      "/api/products/cosmetic",
      expect.objectContaining({ name: "Mascara", price: 15, category: "Cosmetics" })
    );
  });

  it("should handle product update", async () => {
    const mockProducts = [
      { id: 1, name: "Lipstick", price: 20, category: "Cosmetics", image_url: "lipstick.jpg" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockProducts });
    axios.put.mockResolvedValueOnce({});

    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const moreButton = screen.getByRole("button", { name: /more/i });
    fireEvent.click(moreButton);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "Updated Lipstick" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(axios.put).toHaveBeenCalledWith(
      "/api/products/cosmetic/1",
      expect.objectContaining({ name: "Updated Lipstick" })
    );
  });

  it("should handle product deletion", async () => {
    const mockProducts = [
      { id: 1, name: "Lipstick", price: 20, category: "Cosmetics", image_url: "lipstick.jpg" },
    ];
    axios.get.mockResolvedValueOnce({ data: mockProducts });
    axios.delete.mockResolvedValueOnce({});

    render(
      <Router>
        <ProductList />
      </Router>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const moreButton = screen.getByRole("button", { name: /more/i });
    fireEvent.click(moreButton);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByText("Delete");
    fireEvent.click(confirmButton);

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    expect(axios.delete).toHaveBeenCalledWith("/api/products/cosmetic/1");
  });
});
