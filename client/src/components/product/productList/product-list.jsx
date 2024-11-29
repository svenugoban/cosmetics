import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./product-list.css";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { Visibility, Edit, Delete, MoreVert } from "@mui/icons-material";
import CreateEditDialog from "../../../common/create-edit-dialog";
import ProductForm from "../product-form";
import ReusableDialog from "../../../common/dialog";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [page, setPage] = useState(0); // Zero-based page index
  const [pageSize, setPageSize] = useState(10); // Default rows per page
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Menu anchor state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Store selected product

  const fetchProducts = useCallback(async () => {
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
  }, [page, pageSize]); // useCallback will memoize fetchProducts

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleMenuOpen = (event, cosmetic) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedProduct(cosmetic);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleView = () => {
    navigate(`/products/${selectedProduct.id}`); // Navigate to the product detail page
    handleMenuClose();
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditOpen(true);
  };

  const handleClickDelete = () => {
    handleMenuClose();
    setDeleteOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (!taskId) {
      console.error("Task ID is required to delete a cosmetic.");
      return;
    }

    try {
      await axios.delete(`/api/products/cosmetic/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Close the dialog
      setDeleteOpen(false);
      fetchProducts(); // Refresh tasks after deletion
    } catch (error) {
      console.error("Error deleting cosmetic:", error);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box className='container mx-auto p-6'>
      <Grid container mb={1}>
        <Grid item sm={10}>
          <Typography sx={{ fontWeight: "bold", fontSize: "22px", color: "black" }} align='left'>
            Cosmetic Products
          </Typography>
        </Grid>
        <Grid item sm={2}>
          <Button
            variant='contained'
            color='primary'
            align='right'
            onClick={() => {
              setCreateOpen(true);
            }}
          >
            Create Cosmetic
          </Button>
        </Grid>
      </Grid>
      <Box className='bg-white p-4 rounded shadow'>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' mt={3}>
            <Typography>Loading products...</Typography>
          </Box>
        ) : (
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Image</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Product Price ($)</TableCell>
                    <TableCell>Product Category</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.image_url}
                            alt={product.name}
                            style={{ maxWidth: "100px", maxHeight: "80px", objectFit: "cover" }}
                          />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Box display='flex' justifyContent='center' alignItems='center'>
                            <IconButton onClick={(e) => handleMenuOpen(e, product)}>
                              <MoreVert />
                            </IconButton>
                            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                              <MenuItem onClick={handleView}>
                                <Visibility fontSize='small' />
                                <Typography sx={{ ml: 1 }}>View</Typography>
                              </MenuItem>
                              <MenuItem onClick={handleEdit}>
                                <Edit fontSize='small' />
                                <Typography sx={{ ml: 1 }}>Edit</Typography>
                              </MenuItem>
                              <MenuItem onClick={handleClickDelete}>
                                <Delete fontSize='small' />
                                <Typography sx={{ ml: 1 }}>Delete</Typography>
                              </MenuItem>
                            </Menu>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align='center'>
                        No products available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={totalProducts}
              rowsPerPage={pageSize}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setPageSize(parseInt(event.target.value, 10));
                setPage(0); // Reset to the first page when the page size changes
              }}
            />
          </Box>
        )}
      </Box>

      {/* Menu for actions */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleView}>
          <Visibility fontSize='small' />
          <Typography sx={{ ml: 1, color: "black" }}>View</Typography>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize='small' />
          <Typography sx={{ ml: 1, color: "black" }}>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleClickDelete}>
          <Delete fontSize='small' />
          <Typography sx={{ ml: 1, color: "black" }}>Delete</Typography>
        </MenuItem>
      </Menu>
      <CreateEditDialog isOpen={createOpen} title='Create Cosmetic'>
        <ProductForm
          initialValues={{
            name: "",
            price: "",
            category: "",
            description: "",
            usages: "",
            image: "",
          }}
          onSubmit={async (values) => {
            await axios.post("/api/products/cosmetic", values, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          }}
          onClose={() => {
            setCreateOpen(false);
            fetchProducts(); // Refresh tasks
          }}
        />
      </CreateEditDialog>
      <CreateEditDialog isOpen={editOpen} title='Edit Cosmetic'>
        <Box>
          <ProductForm
            enableReinitialize={true}
            initialValues={{
              name: selectedProduct?.name,
              price: selectedProduct?.price,
              category: selectedProduct?.category,
              description: selectedProduct?.description,
              usages: selectedProduct?.usages,
              image: null, // Image should be handled separately, so no initial value
            }}
            onSubmit={async (values) => {
              try {
                await axios.put(`/api/products/cosmetic/${selectedProduct?.id}`, values, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
                fetchProducts(); // Refresh the cosmetic list
                setEditOpen(false); // Close the dialog
              } catch (error) {
                console.error("Error updating cosmetic:", error);
              }
            }}
            onClose={() => {
              setEditOpen(false);
              fetchProducts();
            }}
          />
        </Box>
      </CreateEditDialog>
      <ReusableDialog
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          fetchProducts(); // Refresh tasks after closing the dialog
        }}
        title='Delete Cosmetic'
        submitText='Delete'
        cancelText='Cancel'
        contentText={`Are you sure you want to delete this ${selectedProduct?.name} ?`}
        onSubmit={() => handleDelete(selectedProduct?.id)} // Call the delete function
      />
    </Box>
  );
};

export default ProductList;
