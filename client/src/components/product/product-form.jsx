import React from "react";
import { Formik, Form } from "formik";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";

const categories = ["Category 1", "Category 2", "Category 3"]; // Example categories

const ProductForm = ({ initialValues, onSubmit, onClose }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("category", values.category);
        formData.append("description", values.description);
        formData.append("usages", values.usages);

        // Log values to verify the data before appending to FormData
        console.log("Formik Values:", values);

        if (values.image) {
          formData.append("image", values.image); // Appending the file if selected
        }

        onSubmit(formData)
          .then(() => {
            onClose(); // Close dialog on success
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ values, handleChange, handleBlur, setFieldValue }) => (
        <Form id='productForm'>
          {/* Product Name */}
          <Typography sx={{ fontSize: "14px", color: "black" }} align='left'>
            Product Name
          </Typography>
          <TextField
            name='name'
            fullWidth
            variant='outlined'
            placeholder='Enter product name'
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            sx={{ mt: 1 }}
          />

          {/* Price */}
          <Typography sx={{ fontSize: "14px", color: "black", mt: 2 }} align='left'>
            Price
          </Typography>
          <TextField
            name='price'
            fullWidth
            variant='outlined'
            placeholder='Enter price'
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            sx={{ mt: 1 }}
            type="number"
          />

          {/* Category */}
          <Typography sx={{ fontSize: "14px", color: "black", mt: 2 }} align='left'>
            Category
          </Typography>
          <Autocomplete
            id='category'
            options={categories}
            value={values.category}
            onChange={(event, newValue) => setFieldValue("category", newValue)} // Use setFieldValue for Autocomplete
            renderInput={(params) => <TextField {...params} placeholder='Select category' />}
            fullWidth
          />

          {/* Description */}
          <Typography sx={{ fontSize: "14px", color: "black", mt: 2 }} align='left'>
            Description
          </Typography>
          <TextField
            name='description'
            fullWidth
            variant='outlined'
            multiline
            placeholder='Enter product description'
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            sx={{ mt: 1 }}
          />

          {/* Usages */}
          <Typography sx={{ fontSize: "14px", color: "black", mt: 2 }} align='left'>
            Usages
          </Typography>
          <TextField
            name='usages'
            fullWidth
            variant='outlined'
            multiline
            placeholder='Enter product usage information'
            value={values.usages}
            onChange={handleChange}
            onBlur={handleBlur}
            sx={{ mt: 1 }}
          />

          {/* Image Upload */}
          <Typography sx={{ fontSize: "14px", color: "black", mt: 2 }} align='left'>
            Product Image
          </Typography>
          <input
            type='file'
            name='image'
            accept='image/*'
            onChange={(event) => {
              setFieldValue("image", event.target.files[0]); // Using setFieldValue to update Formik state
            }}
            onBlur={handleBlur}
            style={{ marginTop: 8 }}
          />

          {/* Submit and Cancel buttons */}
          <Grid container spacing={1} sx={{ mt: 2 }} justifyContent='flex-end'>
            <Grid item>
              <Button type='submit' variant='contained' color='primary'>
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => onClose()} variant='contained' color='primary'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
