import React, { useState } from 'react';
import { Dialog, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NewServiceDeleteDialog from './NewServiceDeleteDialog';

const NewEditServiceDialog = ({ open, handleClose }) => {

    const durations = [
        { title: "30 minutes", value: 30 },
        { title: "60 minutes", value: 60 },
        { title: "90 minutes", value: 90 },
        { title: "120 minutes", value: 120 },
      ]

      const [deleteService, setDeleteService] = useState(false)

  const formik = useFormik({
    initialValues: {
      serviceName: '',
      description: '',
      duration: '',
      price: '',
    },
    validationSchema: Yup.object({
        serviceName: Yup.string()
          .required('Service name is required'),
        description: Yup.string()
          .max(1000, 'Must be 1000 characters or less')
          .required('Description is required'),
        duration: Yup.number()
          .required('Duration is required'),
        price: Yup.number()
          .required('Price is required')
          .typeError('Price must be a number')
          .positive('Price must be a positive number')
          .integer('Price must be an integer'),
      }),
    onSubmit: (values) => {
      console.log('Form data:', values);
    },
  });

 const  handleClickonDelete = () =>{
   setDeleteService(true)
 } 

 const handleCloseDeleteService = ()=>{
    setDeleteService(false)
 }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" >
      <div className=" bg-[#121212] text-white p-6  font-Poppins">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Service</h2>
          <div className='flex space-x-4 items-center'>
          <div className='text-red-500 cursor-pointer' onClick={handleClickonDelete}>
                <DeleteOutlineOutlinedIcon />
            </div>
          <button onClick={handleClose} className="text-white font-bold text-xl">X</button>
          </div>
        

          <NewServiceDeleteDialog open={deleteService} onClose={handleCloseDeleteService} />
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Service Name Field */}
          <div>
            <label htmlFor="serviceName" className="block text-gray-400">Service Name</label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={formik.values.serviceName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 mt-1 text-white  bg-[#3A3B3C] rounded"
              placeholder="Service Name"
            />
            {formik.touched.serviceName && formik.errors.serviceName ? (
              <p className="text-red-500 text-sm">{formik.errors.serviceName}</p>
            ) : (
            null
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-gray-400">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 mt-1 text-white  bg-[#3A3B3C] rounded"
              placeholder="Description"
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <p className="text-red-500 text-sm">{formik.errors.description}</p>
            ) : (
              null
            )}
          </div>

          {/* Duration Field */}
          <div className='mb-4'>
          <label className="block text-sm text-gray-400 ">Duration</label>
          <select className="mt-1 block w-full h-12 p-2 rounded-md bg-[#3A3B3C]  text-white shadow-sm focus:ring-0 focus:outline-none " name="duration"
            value={formik.values.duration}
            onChange={(e) => {
              formik.setFieldValue('duration', Number(e.target.value));
            }}
            // onChange={(e) => {
            //   formik.handleChange(e);
            //   const selectedValue = durations.find(item => item.title === e.target.value)?.value;
            //   formik.setFieldValue('duration', selectedValue);
            // }}
            onBlur={formik.handleBlur}
          >
            <option>Select Duration</option>
            {
              durations.map((item, idx) => (
                <option key={idx} value={item.value}>{item.title}</option>
              ))
            }

          </select>
          {formik.touched.duration &&
            formik.errors.duration && (
              <p
                style={{
                  fontSize: "13px",
                  padding: "",
                  color: "red",
                }}
              >
                {formik.errors.duration}
              </p>
            )}
        </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-gray-400">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2 mt-1 text-white  bg-[#3A3B3C] rounded"
              placeholder="499"
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-500 text-sm">{formik.errors.price}</p>
            )}
          </div>

          {/* Create Button */}
          <div className="flex justify-center">
          <button
              type="submit"
              className="px-4 py-2 bg-[#0069B4] rounded-md w-full"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default NewEditServiceDialog;
