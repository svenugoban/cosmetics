import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

const CreateEditDialog = ({
  isOpen,
  title,
  contentText,
  children, // This allows any custom component to be passed
  maxWidth = "sm",
  fullWidth = true,
}) => {
  return (
    <Dialog open={isOpen} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "14px" }}>{contentText}</Typography>
        {children} {/* The passed component will be rendered here */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateEditDialog;
