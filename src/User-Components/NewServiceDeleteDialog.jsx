import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, Button, Checkbox, Typography } from "@mui/material";
import Delete from "../assets/Delete.png"; // Update with the correct path

const NewServiceDeleteDialog = ({ open, onClose }) => {
  const formik = useFormik({
    initialValues: {
      confirmDelete: false,
    },
    validationSchema: Yup.object({
      confirmDelete: Yup.boolean().oneOf([true], "Please confirm to delete"),
    }),
    onSubmit: (values) => {
      alert("Service deleted!");
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <div className="p-6 bg-[#121212] text-white font-Poppins">
        {/* Delete Icon */}
        <div className="flex justify-center mb-4">
          <img src={Delete} alt="Delete Icon" className="w-16 h-16" />
        </div>

        {/* Title */}
        <Typography align="center" variant="h6" className="font-semibold">
          Permanently Deleting Service?
        </Typography>

        {/* Warning Text */}
        <Typography align="left" color="error" className="mt-4">
          This service will be permanently deleted and cannot be restored.
          Please confirm if you want to proceed.
        </Typography>

        {/* Form with Checkbox */}
        <form onSubmit={formik.handleSubmit} className="mt-4">
          <div className="flex items-center justify-left  text-white">
            <Checkbox
              id="confirmDelete"
              name="confirmDelete"
              onChange={formik.handleChange}
              checked={formik.values.confirmDelete}
              sx={{
                color: "white",
                "&.Mui-checked": {
                  color: "white",
                },
              }}
            />
            <label
              htmlFor="confirmDelete"
              className="text-sm md:text-md text-gray-300"
            >
              I want to delete my service.
            </label>
          </div>
          {formik.errors.confirmDelete && (
            <Typography
              color="error"
              variant="body2"
              align="left"
              className="mb-4 pl-2"
            >
              {formik.errors.confirmDelete}
            </Typography>
          )}

          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={onClose} color="primary" className="mr-4">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!formik.values.confirmDelete}
              sx={{
                backgroundColor: formik.values.confirmDelete ? "primary.main" : "gray.300",
                color: formik.values.confirmDelete ? "white" : "gray",
                "&:disabled": {
                  backgroundColor: "gray.300",
                  color: "gray",
                },
              }}
            >
              Delete
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default NewServiceDeleteDialog;
