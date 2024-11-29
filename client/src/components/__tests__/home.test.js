import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";

import { MemoryRouter } from "react-router-dom"; // For navigation mocking
import Home from "./home";

jest.mock("axios"); // Mock Axios
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(), // Mock useNavigate
}));

test("fetches and displays products correctly", async () => {
    const mockData = {
      data: [
        { id: 1, name: "Product A", price: 10, category: "Category 1", image_url: "image1.jpg" },
        { id: 2, name: "Product B", price: 20, category: "Category 2", image_url: "image2.jpg" },
      ],
    };
    axios.get.mockResolvedValueOnce(mockData);
  
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
  
    // Expect loading state
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  
    // Wait for products to be displayed
    await waitFor(() => {
      expect(screen.getByText("Product A")).toBeInTheDocument();
    });
  
    // Check images
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });
  
