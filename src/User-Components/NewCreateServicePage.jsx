import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const NewCreateServicePage = () => {

  
    const durations = [
        { title: "30 minutes", value: 30 },
        { title: "60 minutes", value: 60 },
        { title: "90 minutes", value: 90 },
        { title: "120 minutes", value: 120 },
      ]

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
    //   alert(JSON.stringify(values, null, 2));
      console.log("values", formik.values)
    },
  });

  return (
    <div className="flex w-full bg-[#121212] text-white justify-center min-h-screen font-Poppins">
      <div className=" p-6 rounded-md w-full max-w-lg mx-auto">
        <div className='flex space-x-4 mt-8'>
            <div className='text-white pt-1'>
                <ArrowBackIosIcon />
            </div>

            <h2 className="text-2xl mb-4">Create Service</h2>
        </div>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="serviceName" className="block text-sm">
              Service name
            </label>
            <input
              id="serviceName"
              name="serviceName"
              type="text"
              className="w-full p-2 bg-[#3A3B3C] rounded-md text-white  focus:ring-0 focus:outline-none"
              value={formik.values.serviceName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.serviceName && formik.errors.serviceName ? (
              <div className="text-red-500 text-sm">{formik.errors.serviceName}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full p-2 bg-[#3A3B3C] rounded-md text-white focus:ring-0 focus:outline-none"
              maxLength="1000"
              rows="4"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm">{formik.errors.description}</div>
            ) : null}
          </div>

          {/* <div className="mb-4">
            <label htmlFor="duration" className="block text-sm">
              Duration
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              className="w-full p-2 bg-[#3A3B3C] rounded-md text-white"
              {...formik.getFieldProps('duration')}
            />
          </div> */}

          <div className='mb-4'>
          <label className="block text-sm text-white ">Duration</label>
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

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="text"
              placeholder='499'
              className="w-full p-2 bg-[#3A3B3C] rounded-md text-white focus:ring-0 focus:outline-none"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
                        {formik.touched.price && formik.errors.price ? (
              <div className="text-red-500 text-sm">{formik.errors.price}</div>
            ) : null}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-[#0069B4] rounded-md w-full"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCreateServicePage;
