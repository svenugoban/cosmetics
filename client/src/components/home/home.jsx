import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid"; // Import only the DataGrid component
import "./home.css";
import { Box, Typography } from "@mui/material";

const Home = () => {
  const [page, setPage] = useState(0); // Zero-based page index
  const [pageSize, setPageSize] = useState(10); // Default rows per page
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/products/cosmeticAll?page=${page + 1}&limit=${pageSize}`);
        setProducts(response.data);
        setTotalProducts(response.data.length);
      } catch (err) {
        setError("Error fetching products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize]); // Refetch when page or pageSize changes

  const columns = [
    {
      field: "image_url",
      headerName: "Product Image",
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.name}
          className='product-image'
          style={{ maxWidth: "100px", maxHeight: "80px", objectFit: "cover" }}
        />
      ),
      sortable: false,
      flex: 0.5,
    },
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "price", headerName: "Product Price ($)", flex: 0.5 },
    { field: "category", headerName: "Product Category", flex: 1 },
  ];

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box className='container mx-auto p-6'>
      <Typography sx={{ fontWeight: "bold", fontSize: "22px", color: "black" }} align='left' mb={1}>
        Cosmetic Products
      </Typography>
      <Box className='bg-white p-4 rounded shadow'>
        <DataGrid
          rows={products}
          columns={columns}
          pagination
          paginationMode='server'
          page={page}
          pageSize={pageSize}
          rowCount={totalProducts}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
          loading={loading} // Show loader on API call
        />
      </Box>
    </Box>
  );
};

export default Home;
