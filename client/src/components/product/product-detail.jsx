import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { useParams } from "react-router-dom"; // If you're using React Router to navigate between pages
import axios from "axios";

const ProductDetail = () => {
  const { productId } = useParams(); // Get product ID from URL params (assuming the URL is like `/products/:productId`)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/products/cosmetic/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError("Error fetching product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Refetch when productId changes

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ padding: 10 }}>
      {product && (
        <Grid container spacing={3}>
          {/* Left Side: Product Image */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
              <img src={product.image_url} alt={product.name} style={{ maxWidth: "250px", objectFit: "cover" }} />
            </Paper>
          </Grid>

          {/* Right Side: Product Information */}
          <Grid item xs={12} md={6}>
            <Typography variant='h4' sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>
            <Typography variant='h6' sx={{ color: "green", marginTop: 2 }}>
              ${product.price}
            </Typography>
            <Typography sx={{ marginTop: 2, color: "#333" }}>
              <strong>Description:</strong> {product.description}
            </Typography>
            <Typography sx={{ marginTop: 2, color: "#333" }}>
              <strong>Usage:</strong> {product.usages}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProductDetail;
