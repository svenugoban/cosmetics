import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

const ReusableDialog = ({
  isOpen,
  onClose,
  title,
  contentText,
  children, // This allows any custom component to be passed
  onSubmit,
  cancelText,
  submitText,
  maxWidth = "sm",
  fullWidth = true,
  disable,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "14px" }}>{contentText}</Typography>
        {children} {/* The passed component will be rendered here */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button variant='contained' color='primary' onClick={onSubmit} disabled={disable}>
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableDialog;
