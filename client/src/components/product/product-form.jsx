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
        const payload = {
          name: values.name,
          price: parseFloat(values.price),
          category: values.category,
          description: values.description,
          usages: values.usages,
          image_url: values.image_url,
        };

        onSubmit(payload)
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
      {({ values, handleChange, handleBlur }) => (
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
            type='number'
            sx={{ mt: 1 }}
          />

          {/* Category */}
          <Typography sx={{ fontSize: "14px", color: "black", mt: 2 }} align='left'>
            Category
          </Typography>
          <Autocomplete
            id='category'
            options={categories}
            value={values.category}
            onChange={(event, newValue) => handleChange({ target: { name: "category", value: newValue } })}
            renderInput={(params) => (
              <>
                <TextField {...params} placeholder='Select category' />
              </>
            )}
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

          {/* Image URL */}
          <Typography sx={{ fontSize: "14px", color: "black", mt: 2 }} align='left'>
            Image URL
          </Typography>
          <TextField
            name='image_url'
            fullWidth
            variant='outlined'
            placeholder='Enter image URL'
            value={values.image_url}
            onChange={handleChange}
            onBlur={handleBlur}
            sx={{ mt: 1 }}
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
