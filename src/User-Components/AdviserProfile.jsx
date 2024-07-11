import React, { useEffect, useState } from 'react';
import Profile from '../user-assets/Profile.png'
import Profile_bg from '../user-assets/Profile_bg.png'
import msg from '../user-assets/msg.png'
import color from '../user-assets/color.png'
import review from '../user-assets/review.png'
import videoCard from '../user-assets/videoCard.png'
import photoCard from '../user-assets/photoCard.png'
import { useLocation } from 'react-router-dom';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";

const tabs = ['Services', 'Posts', 'Videos'];

const AdvisorProfile = () => {

    const location = useLocation()
    const database = getDatabase(app);
    const { adviserid, advisername } = location.state || {}

    const [activeTab, setActiveTab] = useState('Services');

    const [adviser, setAdviser] = useState(null)
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    async function getAdviser(userId) {
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
              serviceDetails.push({ data: snapshot.val(), id: snapshot.key });
            } else {
              console.log(`No data available for service ID: ${serviceId}`);
            }
          } catch (error) {
            console.error(`Error fetching service details for service ID: ${serviceId}`, error);
          }
        }
    
        return serviceDetails;
      }

      useEffect(() => {
        if (adviserid) {
          getAdviser(adviserid).then((adviserData) => {
            console.log("adviserData", adviserData)
            setAdviser(adviserData)
            getServiceDetails(adviserData.services).then((servicesData) => {
                console.log("serviceData", servicesData)
              setServices(servicesData)
            });
            setLoading(false); // Update loading state after fetching the user data
          });
        }
        else {
          setLoading(false)
        }
    
    
      }, [adviserid])


    const renderContent = () => {
        switch (activeTab) {
            case 'Services':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3  md:gap-4 font-inter ">
                        {services.map((service, idx) => (((service.data.isPublished ) &&
                            <div key={idx} className="p-4 md:m-2 bg-white rounded-xl md:rounded-2xl border w-full">
                                <h3 className="text-lg font-semibold my-2">{service && service.data ? service.data.service_name :''}</h3>
                                <p className="text-gray-600 text-sm">
                                    {service && service.data ? service.data.about_service :''}
                                </p>
                                <div className="flex  items-center mt-4">
                                    <button className="w-4/6 px-4 py-2 bg-[#0069B4] text-white rounded-xl">Book</button>
                                    <span className="text-lg md:text-xl font-semibold ml-[20px]">₹ {service && service.data ? service.data.price :'N/A'}/-</span>
                                </div>
                            </div>)
                        ))}
                    </div>
                );
            case 'Posts':
                return <div className='grid grid-cols-2 md:grid-cols-3 md:gap-4 font-inter'>
                                              {[1, 2, 3].map((item) => (
                            <div key={item} className="p-4 md:m-2 bg-white rounded-xl md:rounded-2xl  w-full">
                                     <img src={photoCard}
                                        alt=""
                                        className='h-auto w-full object-cover'
                                        />
                            </div>
                        ))}
                </div>;
            case 'Videos':
                return <div className='grid grid-cols-2 md:grid-cols-4 md:gap-4 font-inter'>
                {[1, 2, 3,4].map((item) => (
<div key={item} className="p-4 md:m-2 bg-white rounded-xl md:rounded-2xl  w-full">
       <img src={videoCard}
          alt=""
          className='h-auto w-full object-cover'
          />
</div>
))}
</div>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white pb-[80px] font-inter">
            <div className="relative w-full h-48 md:h-64">
                <img src={Profile_bg} alt="Background" className="w-full h-full object-cover" />
            </div>


            <div className="md:mx-[200px] relative flex flex-col  -mt-12 md:-mt-24 px-4 md:px-16">
                <div className="flex flex-col md:flex-row justify-between ">

                    <div className='flex '>
                        <div className="flex-shrink-0">
                            <img src={Profile} alt="Profile" className="w-24 h-24 md:w-48 md:h-48 rounded-full border-4 border-white" />
                        </div>

                        <div className="ml-4 md:ml-8 mt-[45px] md:mt-[100px] md:w-[600px] break-words">

                            <div className='flex items-center mt-2 md:mt-4'>
                                <h2 className="text-xl md:text-2xl  font-semibold">{adviser ? adviser.username : ''}</h2>

                                <div className="hidden md:flex space-x-4 mx-4">
                                    <button className="px-8 py-[13px] bg-[#0069B4] text-white rounded-md">Follow</button>
                                    <button >
                                        <img src={msg} alt="" className='' />
                                    </button>
                                </div>
                            </div>


                            <div className="flex space-x-2 md:space-x-4 mt-1 md:mt-4">
                                <p><span className='font-bold text-sm'>{adviser && adviser.followers ? adviser.followers.length : 0}</span> followers</p>
                                <p><span className='font-bold text-sm'>{adviser && adviser.posts ? adviser.posts.length: 0}</span> posts</p>
                            </div>

                            <div className='hidden md:block'>
                                <p className='font-semibold mt-4 text-sm md:text-md'>{adviser && adviser.professional_title ? adviser.professional_title :''}</p>
                                <p className='mt-2 text-gray-600 text-[10px] md:text-sm'>{adviser && adviser.professional_bio ? adviser.professional_bio :''}</p>
                            </div>



                        </div>
                    </div>


                    <div className="hidden md:block mt-[110px] space-y-4 mr-[40px] ">
                        <div className="flex items-center space-x-2">
                            <img src={color} alt="" />
                            <div>
                                <p className="text-lg font-bold">{adviser && adviser.published_services ? adviser.published_services.length : 0}</p>
                                <p className="text-gray-600">Services given</p>

                            </div>

                        </div>
                        <div className="flex items-center space-x-2">
                            <img src={review} alt="" />
                            <div>
                                <p className="text-lg font-bold">15</p>
                                <p className="text-gray-600">Reviews</p>

                            </div>

                        </div>

                    </div>

                    <div className="md:hidden mt-4  flex  justify-between mx-2 px-4 py-2 bg-gray-100 rounded-full">
                        <div className="flex  items-center space-x-2">
                            <img src={color} alt="" className='h-8' />
                            <div className='text-sm'>
                                <p className=" font-bold">{adviser && adviser.published_services ? adviser.published_services.length : 0}</p>
                                <p className="text-gray-600 ">Services given</p>

                            </div>

                        </div>
                        <div className="flex items-center space-x-2">
                            <img src={review} alt="" className='h-8' />
                            <div className='text-sm'>
                                <p className=" font-bold">15</p>
                                <p className="text-gray-600">Reviews</p>

                            </div>

                        </div>

                    </div>

                    <div className='md:hidden block mx-2'>
                        <p className='font-semibold mt-2 text-sm'>{adviser && adviser.professional_title ? adviser.professional_title :''}</p>
                        <p className='mt-1 text-gray-600 text-[12px]'>{adviser && adviser.professional_bio ? adviser.professional_bio :''}</p>
                    </div>

                    <div className='md:hidden flex mt-4 '>
                        <button className=" w-5/6 px-8 py-[8px] bg-[#0069B4] text-white rounded-md">Follow</button>
                        <button className='ml-2'>
                            <img src={msg} alt="" className='h-12' />
                        </button>
                    </div>


                </div>

            </div>



            <div className="mt-16  px-2 md:px-[100px]">
                <div className="flex justify-center space-x-4 border-b border-gray-300">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 focus:outline-none ${activeTab === tab ? 'border-b-2 border-[#0069B4] text-[#0069B4]' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="my-8 mx-2 md:mx-4">{renderContent()}</div>
            </div>
        </div>
    );
};

export default AdvisorProfile;