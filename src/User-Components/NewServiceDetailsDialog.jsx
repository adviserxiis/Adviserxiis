import React, { useState } from 'react';
import { Dialog, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const NewServiceDetailsDialog = ({ open, handleClose }) => {


  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" >
      <div className=" bg-[#121212] text-white p-6  font-Poppins">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold"> Service</h2>
          <div className='flex space-x-4 items-center'>

          <button onClick={handleClose} className="text-white font-bold text-xl">X</button>
          </div>
        </div>

        <div className='flex flex-col '>
        <div className='flex-1'>
        <h2 className='text-2xl my-4'> UI UX Career Counselling</h2>

        <h2 className='text-lg mb-4'><span className='font-semibold'>Duration-</span>1 Hour</h2>

        <h2 className='text-lg mt-4'>I will provide you personal guidance on how to become UI/UX designer. What all tools you need to learn, and make projects to land on your first Job as UI/UX Designer.</h2>
        </div>
        <div className='flex items-center mt-16'>
            <div className='flex flex-col items-center'>
          <div className='text-gray-600'>
            Price
          </div>
          <div className='text-3xl font-semibold text-[#0069B4]'>
            499
          </div>
          </div>
          <div className='w-full ml-4 '>
          <button
              type="submit"
              className="px-4 py-2 bg-[#0069B4] rounded-md w-full"
            >
              Buy Now
            </button>
          </div>
        </div>
        </div>

      </div>
    </Dialog>
  );
};

export default NewServiceDetailsDialog;
