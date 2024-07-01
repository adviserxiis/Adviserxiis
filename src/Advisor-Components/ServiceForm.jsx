import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { Button, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import AvailabilitySchedule from './AvailabilitySchedule';
import { useNavigate } from 'react-router-dom';

const ServiceForm = () => {

  const database = getDatabase(app);
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate()

  const durations = [
    { title: "30 minutes", value: 30 },
    { title: "60 minutes", value: 60 },
    { title: "90 minutes", value: 90 },
    { title: "120 minutes", value: 120 },
  ]

  const initialValues = {
    service_name: '',
    about_service: '',
    duration: '',
    price: '',
    // booking_days: '',
    // booking_time:''
    availability:null
  }

  const validationSchema = Yup.object().shape({
    service_name: Yup.string()
      .required('Service name is required')
      .min(2, 'Service name must be at least 2 characters long')
      .max(50, 'Service name cannot be more than 50 characters long'),
    about_service: Yup.string()
      .required('About service is required')
      .min(10, 'About service must be at least 10 characters long')
      .max(500, 'About service cannot be more than 500 characters long'),
    duration: Yup.string()
      .required('Duration is required'),
    price: Yup.number()
      .required('Price is required')
      .typeError('Price must be a number')
      .positive('Price must be a positive number')
      .integer('Price must be an integer'),
    // booking_days: Yup.string()
    //   .required('Booking days is required'),
    // booking_time: Yup.string()
    //   .required('Booking time is required'),
    // availability: Yup.mixed()
    //   .nullable()
    //   .required('You have to set your availability')
  });

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  async function getUser(userId) {
    const nodeRef = ref(database, `advisers/${userId}`);
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return null;
    }
  }
  

  const handleSubmit = async () => {
          
    setLoading(true)
    const serviceid = uuidv1();
    const userid = JSON.parse(localStorage.getItem('adviserid'))

   await set(ref(database, 'advisers_service/' + serviceid),{

      adviserid:userid,
      service_name:formik.values.service_name,
      about_service:formik.values.about_service,
      duration:formik.values.duration,
      price:formik.values.price,
      // booking_days:formik.values.booking_days,
      // booking_time:formik.values.booking_time
      // availability:formik.values.availability

    });


    
    const adviserData = await getUser(userid)
    const currentServices = adviserData.services || []; // Retrieve existing IDs or initialize to an empty array
  
    // Add the new ID to the array
    const updatedServices = [...currentServices, serviceid];
  
    // Update the array field in the database
    await update(ref(database, 'advisers/' + userid), { services : updatedServices });
  

     await Swal.fire({
      title: "Success",
      text: "Your Service Added Successfully!!",
      icon: "success"
    });
       setLoading(false)
    formik.resetForm();

  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })


  const deleteHandler = () =>{
    formik.resetForm()
  }

  useEffect(()=>{
    const adviserid = JSON.parse(localStorage.getItem('adviserid'))
     getUser(adviserid).then((user)=>{
         if(user.availability == undefined)
          {
            Swal.fire({
              title: "Oops!!",
              text: "You have to set your availability in calender before creating any service in service.",
              icon: "error"
            });
            navigate('/adviser/services')

          }
     })

  },[])

  return (
    <div className="flex flex-col p-6 space-y-6">
      <p className='font-Poppins text-3xl font-bold s my-2'>Services</p>
      <form className="bg-[#D9D9D942] p-6 rounded-xl shadow-md space-y-6 md:w-3/6 ">
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Service Name</label>
          <input
            name="service_name"
            value={formik.values.service_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='CV Review'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 font-Poppins"
          />
                        {formik.touched.service_name &&
                formik.errors.service_name && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.service_name}
                  </p>
                )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins ">About Service</label>
          <textarea
            name="about_service"
            value={formik.values.about_service}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Talent Acquisition Specialist at JindalX || Tech Mahindra || TCS'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 font-Poppins"
            rows="3"
          />
                        {formik.touched.about_service &&
                formik.errors.about_service && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.about_service}
                  </p>
                )}
        </div>
        {/* <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Duration</label>
          <input
            name="duration"
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='1 hour'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 font-Poppins shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
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
        </div> */}

<div >
              <label className="block text-sm font-bold text-gray-700 font-Poppins ">Duration:</label>
              <select className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 font-Poppins" name="duration"
                // value={formik.values.duration}
                onChange={(e) => {
                  formik.handleChange(e);
                  const selectedValue = durations.find(item => item.title === e.target.value)?.value;
                  formik.setFieldValue('duration', selectedValue);
                }}
                onBlur={formik.handleBlur}
              >
                <option>Select Duration</option>
                {
                  durations.map((item,idx) => (
                    <option>{item.title}</option>
                  ))
                }
             

                {/* Add other options here */}
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
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Price</label>
          <input
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            placeholder='499'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 font-Poppins shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
                        {formik.touched.price &&
                formik.errors.price && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.price}
                  </p>
                )}
        </div>
        {/* <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Booking Days</label>
          <input
            name="booking_days"
            value={formik.values.booking_days}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='Mon, Wed, Fri'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 shadow-sm font-Poppins focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
                        {formik.touched.booking_days &&
                formik.errors.booking_days && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.booking_days}
                  </p>
                )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 font-Poppins">Booking Time</label>
          <input
            name="booking_time"
            value={formik.values.booking_time}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder='8:00pm - 9:00pm, 10:00pm - 12:00pm'
            className="mt-1 block w-full h-12 p-2 rounded-md border-gray-300 font-Poppins shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
                        {formik.touched.booking_time &&
                formik.errors.booking_time && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.booking_time}
                  </p>
                )}
        </div> */}

        {/* <div>
        <Button onClick={handleDialogOpen} variant="contained" color="primary">Set Availability</Button>
        <AvailabilitySchedule open={dialogOpen} handleClose={handleDialogClose} formik={formik}/>
        {formik.touched.availability &&
                formik.errors.availability && (
                  <p
                    style={{
                      fontSize: "13px",
                      padding: "",
                      color: "red",
                    }}
                  >
                    {formik.errors.availability}
                  </p>
                )}
        </div> */}
        <div className="flex space-x-4">
          <button className="bg-[#489CFF] text-white rounded-md py-2 px-4 font-Poppins" onClick={formik.handleSubmit} type="submit">
          { !loading ? 'Publish' : <CircularProgress  color="inherit"  />}
          </button>
          <button className="bg-[#FF5348] text-white rounded-md py-2 px-4 font-Poppins" onClick={deleteHandler}>Delete</button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
