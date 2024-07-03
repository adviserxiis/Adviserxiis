import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';


function Services() {
  const database = getDatabase(app);
  const [adviser, setAdviser] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUpdated, setIsUpdated] = useState(false) //state to re-render data after publihing any service
  

  const navigate= useNavigate()
  const adviserid = JSON.parse(localStorage.getItem('adviserid'))


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


  async function getServiceDetails(serviceIds) {
    const serviceDetails = [];
  
    for (const serviceId of serviceIds) {
      const serviceRef = ref(database, `advisers_service/${serviceId}`);
      try {
        const snapshot = await get(serviceRef);
        if (snapshot.exists()) {
          serviceDetails.push({data:snapshot.val(),id:snapshot.key});
        } else {
          console.log(`No data available for service ID: ${serviceId}`);
        }
      } catch (error) {
        console.error(`Error fetching service details for service ID: ${serviceId}`, error);
      }
    }
  
    return serviceDetails;
  }

  const publishHandler = async(serviceid , adviserid) =>{
        setLoading(true)

        const adviserData = await getUser(adviserid)

    await update(ref(database, 'advisers_service/' + serviceid),{
      isPublished:true
    });


    const publishedServices = adviserData.published_services || [];

    const updatedpublishedServices = [...publishedServices, serviceid];

    await update(ref(database, 'advisers/' + adviserid), { published_services : updatedpublishedServices }); 


      await Swal.fire({
      title: "Success",
      text: "Service Published Successfully!!",
      icon: "success"
    });
    setLoading(false)
    setIsUpdated(!isUpdated)
  }

  const EditHandler = (serviceId) =>{
        
    navigate (`/adviser/editservice`,{
      state:{
        serviceid:serviceId
      }
    })
  }

  useEffect(()=>{
    getUser(adviserid).then((adviserData) => {
      setAdviser(adviserData)
      getServiceDetails(adviserData.services).then((servicesData) => {
        setServices(servicesData)
      });
      setLoading(false); // Update loading state after fetching the user data
    });

  },[isUpdated])

  if (loading) {
    return <div className='h-screen flex justify-center items-center'><CircularProgress  /></div>; // Show a loading message or spinner while fetching data
  }
  return (
    <div className="flex flex-col pt-0 py-6 px-2 sm:p-6 space-y-6">

    <div className="flex justify-between items-center">
    <p className='font-Poppins text-3xl md:text-4xl lg:text-5xl font-bold s my-2'>Services</p>
      <button className="bg-[#489CFF] text-white rounded-md py-2 mx-2 px-2 md:px-4 md:text-lg lg:text-xl" onClick={()=> navigate('/adviser/createservice')}>Create New Service</button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">


    {services.length > 0 ? services.map((service, idx) => (
  <div className="bg-gray-100 p-6 rounded-xl shadow-md" key={idx} >
    <h2 className="text-xl font-bold font-Poppins break-words">{service.data.service_name}</h2>
    <p className="mt-2 text-gray-700 font-Poppins break-words">{service.data.about_service}</p>
    <p className="mt-4 font-bold font-Poppins">Duration: {service.data.duration} | Rs {service.data.price}/-</p>
    <button className="mt-4 bg-[#489CFF] text-white rounded-md py-2 px-4 md:px-[30px] font-Poppins" onClick={()=>EditHandler(service.id)}>Edit</button>
    { service.data.isPublished == false &&  <button className="mt-4 bg-[#489CFF] text-white rounded-md py-2 px-4 md:px-[30px] font-Poppins mx-4"onClick={()=>publishHandler(service.id, adviserid)}>Publish</button>}
    
  </div>
)): <div className='w-full h-full'>
    <p className='font-Poppins text-2xl md:text-4xl text-gray-500'>No service available !!</p>
  
  </div>}


    </div>
  </div>
  )
}

export default Services