import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid"; // Import only the DataGrid component
import "./home.css";
import { Box, IconButton, Typography, Menu, MenuItem, Button, Grid } from "@mui/material";
import { Visibility, Edit, Delete, MoreVert } from "@mui/icons-material";
import CreateEditDialog from "../../common/create-edit-dialog";
import ProductForm from "../form/product";
import ReusableDialog from "../../common/dialog";

const Home = () => {
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

  // Columns with actions
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
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.5,
      renderCell: (params) => (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
            <MoreVert />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleMenuOpen = (event, cosmetic) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedProduct(cosmetic);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleView = () => {
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
            image_url: "",
          }}
          onSubmit={async (values) => {
            await axios.post("/api/products/cosmetic", values, {
              headers: { "Content-Type": "application/json" },
            });
          }}
          onClose={() => {
            setCreateOpen(false);
            fetchProducts(); // Refresh tasks
          }}
        />
      </CreateEditDialog>
      <CreateEditDialog isOpen={editOpen} title='Edit Task'>
        <Box>
          <ProductForm
            enableReinitialize={true}
            initialValues={{
              name: selectedProduct?.name,
              price: selectedProduct?.price,
              category: selectedProduct?.category,
              description: selectedProduct?.description,
              usages: selectedProduct?.usages,
              image_url: selectedProduct?.image_url,
            }}
            onSubmit={async (values) => {
              try {
                await axios.put(`/api/products/cosmetic/${selectedProduct?.id}`, values, {
                  headers: { "Content-Type": "application/json" },
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

export default Home;
