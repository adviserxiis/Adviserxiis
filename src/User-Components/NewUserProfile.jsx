import React, { useEffect, useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import Divider from '@mui/material/Divider';
import { Dialog, IconButton } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import profile_background from '../assets/profile_background.jpg'
import facebook from '../assets/facebook.png';
import linkedin from '../assets/linkedin.png';
import instagram from '../assets/instagram.png';
import User from '../assets/User.png';
import card_bg from '../assets/card_bg.jpeg'
import NewCreateServiceDialog from './NewCreateServiceDialog';
import { useNavigate } from 'react-router-dom';
import NewEditServiceDialog from './NewEditServiceDialog';
import NewFeedPost from './NewFeedPost';
import NewVideoCard from './NewVideoCard';
import { ViewSidebar } from '@mui/icons-material';

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [services, setServices] = useState([])
    const [bookings, setBookings] = useState([])
    const [reels, setReels] = useState([])
    const [views, setViews] = useState(0)
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [createServiceOpen, setCreateServiceOpen] = useState(false);
    const [editServiceOpen, setEditServiceOpen] = useState(false)
    const userid = JSON.parse(localStorage.getItem('userid'));

    useEffect(()=>{
        const userid = JSON.parse(localStorage.getItem('userid'));
        if(userid == null)
        {
          navigate("/signin")
        }
      },[])

    const getCreator = async () => {
        try {
            const response = await fetch(
                `https://adviserxiis-backend-three.vercel.app/creator/getuser/${userid}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            const jsonResponse = await response.json();
            // console.log('Creator Details', jsonResponse);
            setUser(jsonResponse)
        } catch (error) {
            console.error('Error fetching creator details:', error);
        }
    };

    const getPostsOfCreator = async () => {
        try {
            const response = await fetch(
                `https://adviserxiis-backend-three.vercel.app/post/gethomepostsofadviser/${userid}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            const jsonResponse = await response.json();
            // console.log('Posts Details', jsonResponse);
            setPosts(jsonResponse)
        } catch (error) {
            console.error('Error fetching creator Posts details:', error);
        }
    };

    const getServicesOfCreator = async () => {
        try {
            const response = await fetch(
                `https://adviserxiis-backend-three.vercel.app/service/getallservicesofadviser/${userid}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            const jsonResponse = await response.json();
            // console.log('Service Details', jsonResponse.services);
            setServices(jsonResponse.services)
        } catch (error) {
            console.error('Error fetching Service details:', error);
        }
    };

    const getBookingsOfCreator = async () => {
        try {
            const response = await fetch(
                `https://adviserxiis-backend-three.vercel.app/service/getbookingsofuser/${userid}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            const jsonResponse = await response.json();
            // console.log('Bookings Details', jsonResponse.bookings);
            setBookings(jsonResponse.bookings)
        } catch (error) {
            console.error('Error fetching Booking details:', error);
        }
    };

    const getReelsOfCreator = async () => {
        try {
            const response = await fetch(
                `https://adviserxiis-backend-three.vercel.app/post/getpostsofadviser/${userid}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            const jsonResponse = await response.json();
            console.log('Reels Details', jsonResponse);
            const totalViews = jsonResponse
                .map(reel => reel?.data?.views?.length || 0) 
                .reduce((acc, views) => acc + views, 0); 

            // console.log('Total Views:', totalViews);
            setViews(totalViews)

            setReels(jsonResponse)
        } catch (error) {
            console.error('Error fetching Reels details:', error);
        }
    };

    useEffect(() => {
        if (userid) {
            getCreator();
            getPostsOfCreator();
            getServicesOfCreator();
            getBookingsOfCreator();
            getReelsOfCreator()
        }

    }, [userid])

    function formatDate(dateString) {
        const date = new Date(dateString);

        // Get day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        // Return in dd-mm-yyyy format
        return `${day}-${month}-${year}`;
    }

    function convertDateFormat(dateString) {
        // Split the date string into parts
        const [year, month, day] = dateString.split('-');

        // Return in dd-mm-yyyy format
        return `${day}-${month}-${year}`;
    }


    // const posts = [
    //     {
    //         id: 1,
    //         type: 'image',
    //         media: ['https://firebasestorage.googleapis.com/v0/b/adviserxiis-920e5.appspot.com/o/posts%2Feff98a10-7349-11ef-a3ce-77d7974f08a2%2Feff98a10-7349-11ef-a3ce-77d7974f08a2_1726394686769_image0.jpg?alt=media&token=dc01a3bb-3fb8-4418-8d16-772833d64dd7', 'https://firebasestorage.googleapis.com/v0/b/adviserxiis-920e5.appspot.com/o/posts%2Feff98a10-7349-11ef-a3ce-77d7974f08a2%2Feff98a10-7349-11ef-a3ce-77d7974f08a2_1726394686784_image1.jpg?alt=media&token=c83607a6-3468-4f7e-a21f-02073bfb84ff', 'https://firebasestorage.googleapis.com/v0/b/adviserxiis-920e5.appspot.com/o/posts%2Feff98a10-7349-11ef-a3ce-77d7974f08a2%2Feff98a10-7349-11ef-a3ce-77d7974f08a2_1726394686785_image2.jpg?alt=media&token=f1d6c92f-73f5-47bb-9f61-3b7cd3fc771b'],
    //         description: 'A beautiful view of the park...',
    //         tags: ['#park', '#giantwheel', '#lights', '#fun'],
    //     },
    //     {
    //         id: 2,
    //         type: 'video',
    //         media: ['https://myluinkai.b-cdn.net/rn_image_picker_lib_temp_3ede73b6-15ce-4e1e-b350-71a1ceb2527d.mp4', 'https://myluinkai.b-cdn.net/rn_image_picker_lib_temp_97341423-4774-4756-8a18-72b6ed80d006.mp4'],
    //         description: 'Fun moments at the beach...',
    //         tags: ['#beach', '#sunset'],
    //     },
    //     {
    //         id: 3,
    //         type: 'text',
    //         description: 'Just a simple text post with no media.',
    //         tags: ['#thoughts', '#inspiration'],
    //     },
    // ];


    const navigate = useNavigate()

    const openCalendar = () => {
        setCalendarOpen(true);
    };

    const closeCalendar = () => {
        setCalendarOpen(false);
    };

    const handleCreateServiceClick = () => {

        if (window.innerWidth < 768) {
            navigate('/createservice');
        } else {
            setCreateServiceOpen(true);
        }
    };

    const handleCloseCreateServiceDialog = () => {
        setCreateServiceOpen(false);
    };

    const handleEditServiceClick = () => {

        if (window.innerWidth < 768) {
            navigate('/editservice');
        } else {
            setEditServiceOpen(true);
        }
    };

    const handleCloseEditServiceDialog = () => {
        setEditServiceOpen(false);
    };

    const tabContent = {
        posts: (
            <div className="flex flex-col items-center p-4 bg-[#121212]  pb-24 text-white  font-Poppins">


                {posts.map((post) => (
                    <NewFeedPost key={post.id} post={post} />
                ))}
            </div>
        ),
        reels: (
            <div className="grid grid-cols-3 gap-2 p-4 bg-[#121212]  pb-24 text-white  font-Poppins">


                {reels.map((reel) => (
                    <NewVideoCard src={reel?.data?.post_file} />
                ))}
            </div>
        ),
        services: (
            <div className="space-y-4">
                <div className="flex justify-end items-center">
                    {/* <h2 className="text-lg font-semibold">Services</h2> */}
                    {/* Calendar Button */}
                    <IconButton aria-label="Add Service" className="text-white" onClick={handleCreateServiceClick}>
                        <div className='flex items-center text-white bg-blue-500 rounded-full px-4 py-2'>
                            <p className='text-[15px]'>Add Service</p>
                        </div>



                    </IconButton>

                    <IconButton onClick={openCalendar} aria-label="calendar" className="text-white">
                        <div className='flex items-center text-white bg-blue-500 rounded-full px-4 py-2'>
                            <div className='text-[5px] mr-2'>
                                <CalendarTodayIcon />
                            </div>
                            <p className='text-[15px]'>Calender</p>
                        </div>

                    </IconButton>
                </div>

                {services.map((service) => (
                    <div className="p-4 border border-gray-500 rounded-xl">
                        <div className='flex justify-between items-center'>
                            <h3 className="text-lg lg:text-xl font-semibold my-2">{service?.service_name}</h3>
                            <p className='font-bold text-lg lg:text-xl text-[#0069B4]'>₹{service?.price}</p>
                        </div>
                        <p className='my-2'>{service?.about_service}</p>
                        <p className='my-2'>Duration: {service?.duration}</p>
                        <button className="mt-2 px-4 py-2 text-sm font-semibold w-full  border rounded" onClick={handleEditServiceClick}>Edit</button>
                    </div>
                ))}





                {/* Calendar Dialog */}
                <Dialog open={calendarOpen} onClose={closeCalendar}>
                    <div className="p-4 bg-white text-black rounded-lg">
                        <DateCalendar />
                    </div>
                </Dialog>


                <NewCreateServiceDialog open={createServiceOpen} handleClose={handleCloseCreateServiceDialog} />

                <NewEditServiceDialog open={editServiceOpen} handleClose={handleCloseEditServiceDialog} />
            </div>
        ),
        bookings: (
            <div className="space-y-4">

                {bookings.map((booking) => (
                    <div className="p-4 border border-gray-500 rounded-xl">
                        <div className='flex justify-between items-center'>
                            <h3 className="text-lg lg:text-xl font-semibold my-2">{booking?.serviceDetails?.service_name}</h3>
                            <p className='font-bold text-lg lg:text-xl text-[#0069B4]'>₹{booking?.serviceDetails?.price}</p>
                        </div>
                        <p className='my-2'><span className='text-gray-400'>Purchase date : </span>{formatDate(booking?.purchased_date)}</p>
                        <p className='my-2'><span className='text-gray-400'>Booking date : </span>{convertDateFormat(booking?.scheduled_date)}</p>

                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='mb-2'><span className='text-gray-400'>Time : </span>{booking?.scheduled_time}</p>
                                <p className='my-2'><span className='text-gray-400'>Offer By : </span>{booking?.adviserDetails?.name}</p>
                            </div>
                            <button className="mt-2 px-8 border-none py-2 text-sm font-semibold bg-[#0069B4] border rounded">Join</button>
                        </div>
                    </div>
                ))}

            </div>
        ),
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#121212] text-white font-Poppins">
            {/* Profile Header - Full width background image */}
            <div className="relative w-full">
                <div
                    className="h-32 md:h-48 w-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${user?.profile_background})`, // Replace with actual background image URL
                    }}
                ></div>
                <div className="absolute -bottom-12 md:-bottom-16 md:left-32 lg:left-48 flex items-center">
                    <img
                        src={user?.profile_photo || User}
                        alt="Profile"
                        className="w-24 h-24  md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full border-4 border-gray-900"
                    />

                </div>

                <div className='absolute -bottom-12 md:-bottom-16 left-16 lg:left-80 ml-4 mt-2 flex items-center'>
                    <div className="ml-4">
                        <h2 className="text-xl lg:text-2xl font-bold">{user?.username}</h2>
                        <p className="text-sm  md:text-md lg:text-lg">{user?.professional_title}</p>
                    </div>
                </div>

                <div className='absolute -bottom-12 md:-bottom-16 right-16 lg:right-80 ml-4 mt-2 flex items-center'>
                    <div className="ml-4">
                        <a href="#" className="text-sm  md:text-md lg:text-xl  text-blue-500">Edit Profile</a>
                    </div>
                </div>
                <div className="absolute top-4 right-8">
                    <ShareIcon />
                </div>
            </div>




            {/* Content with margins */}
            <div className="px-4 md:px-40 lg:px-64">

                <div className='mt-20'>
                    <div className="ml-4">
                        <p className="text-md md:text-lg lg:text-xl">{user?.professional_title}</p>
                        <p className="text-sm  md:text-md lg:text-lg text-[#9C9C9C]">{user?.professional_title}</p>
                    </div>
                </div>

                {/* Social Links */}
                {/* <div className="mt-4 flex items-center justify-start space-x-4">
                    <img
                        src={instagram}
                        className='h-8  md:h-12 '
                    />

                    <img
                        src={linkedin}
                        className='h-8  md:h-12 '
                    />

                    <img
                        src={facebook}
                        className='h-8  md:h-12 '
                    />
                </div> */}
                <div className="mt-4 flex items-center justify-start space-x-4">
                    {user?.social_links?.instagram && (
                        <a href={user?.social_links?.instagram} target="_blank" rel="noopener noreferrer">
                            <img src={instagram} alt="Instagram" className='h-8 md:h-12' />
                        </a>
                    )}
                    {user?.social_links?.linkedin && (
                        <a href={user?.social_links?.linkedin} target="_blank" rel="noopener noreferrer">
                            <img src={linkedin} alt="LinkedIn" className='h-8 md:h-12' />
                        </a>
                    )}
                    {user?.social_links?.facebook && (
                        <a href={user?.social_links?.facebook} target="_blank" rel="noopener noreferrer">
                            <img src={facebook} alt="Facebook" className='h-8 md:h-12' />
                        </a>
                    )}
                </div>

                {/* Earnings Card - Placed just below the profile */}
                <div className="mt-4  text-black p-4 rounded-lg bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${card_bg})`, // Replace with actual background image URL
                    }}>
                    <p className='text-xl lg:text-2xl'>Your Earnings</p>
                    <div className='flex items-center justify-between mt-4'>
                        <h3 className="text-2xl lg:text-4xl font-bold">₹{user?.earnings || 0}</h3>
                        <button className="mt-2 border border-black text-black px-4 py-2 rounded-full font-bold">Withdraw</button>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center items-center mt-6 text-center space-x-6 md:space-x-12 lg:space-x-20">
                    <div>
                        <p className="font-bold text-lg">{user?.followers?.length || 0}</p>
                        <p className="text-sm">Followers</p>
                    </div>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'gray' }} />
                    <div>
                        <p className="font-bold text-lg">{reels.length}</p>
                        <p className="text-sm">Reels</p>
                    </div>
                    <Divider orientation="vertical" flexItem sx={{ backgroundColor: 'gray' }} />
                    <div>
                        <p className="font-bold text-lg">{views}</p>
                        <p className="text-sm">Views</p>
                    </div>
                </div>

                {/* Centered Tabs */}
                <div className="mt-8">
                    <div className="flex justify-center space-x-6 border-b border-gray-700">
                        <button
                            className={`pb-2 ${activeTab === 'posts' ? 'text-blue-500 border-blue-500 border-b-2' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                        <button
                            className={`pb-2 ${activeTab === 'reels' ? 'text-blue-500 border-blue-500 border-b-2' : ''}`}
                            onClick={() => setActiveTab('reels')}
                        >
                            Reels
                        </button>
                        <button
                            className={`pb-2 ${activeTab === 'services' ? 'text-blue-500 border-blue-500 border-b-2' : ''}`}
                            onClick={() => setActiveTab('services')}
                        >
                            Services
                        </button>
                        <button
                            className={`pb-2 ${activeTab === 'bookings' ? 'text-blue-500 border-blue-500 border-b-2' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            Bookings
                        </button>
                    </div>

                    {/* Content based on active tab */}
                    <div className="mt-4">{tabContent[activeTab]}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
