import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { Menu, Transition } from "@headlessui/react";

function NewUserFooter() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleClickOnUploadReel = () => {
    if (window.innerWidth < 768) {
        navigate('/uploadreel');
    } else {
        setCreateReelOpen(true);
    }
  };
  
  const handleClickOnCreatePost = () => {
    if (window.innerWidth < 768) {
        navigate('/createpost');
    } else {
        setCreatePostOpen(true);
    }
  };

  return (
    <div className='fixed bottom-0 left-0 w-full bg-[#121212] text-white'>
    <div className='container mx-auto font-Poppins'>
    <div className='w-full flex justify-between p-4 px-[20px]  lg:px-[40px] '>
        <NavLink to="/" exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''} >
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <HomeOutlinedIcon fontSize='inherit'/>
          </div>
          {/* <p className=' text-xs sm:text-md md:text-lg '>Dashboard</p> */}
        </div>
        </NavLink>



        <NavLink to='/searchcreator'  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <SearchIcon fontSize='inherit'/>
          </div>
          {/* <p className='text-xs sm:text-md md:text-lg '>Services</p> */}
        </div>
        </NavLink>

        <NavLink to='/reels'  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <PlayArrowOutlinedIcon fontSize='inherit'/>
          </div>
          {/* <p className='text-xs sm:text-md md:text-lg '>Reels</p> */}
        </div>
        </NavLink>

        {/* <NavLink to="/uploadreel"  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
            <div className='text-2xl md:text-3xl lg:text-4xl'>
                <AddIcon fontSize='inherit' />
            </div>

        </div>
        </NavLink> */}

<Menu as="div" className="relative">
            <Menu.Button className="w-full flex items-center justify-between text-left rounded cursor-pointer transition-colors text-gray-300 hover:text-white">
              <p className="font-Poppins font-2xl text-[20px] flex items-center">
                <span className="mr-2">
                  <AddIcon fontSize="medium" />
                </span>
              </p>
            </Menu.Button>
            <Menu.Items className="absolute bottom-8 right-0 w-[200px] bg-gray-800 rounded shadow-lg">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`px-4 py-2 cursor-pointer ${
                      active ? "bg-gray-700 text-white" : "text-gray-300"
                    }`}
                    // onClick={() => navigate("/uploadreel")}
                    onClick={handleClickOnUploadReel}
                  >
                    Upload Reel
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`px-4 py-2 cursor-pointer ${
                      active ? "bg-gray-700 text-white" : "text-gray-300"
                    }`}
                    // onClick={() => navigate("/createpost")}
                    onClick={handleClickOnCreatePost}
                  >
                    Create Post
                  </div>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <div
                    className={`px-4 py-2 cursor-pointer ${
                      active ? "bg-gray-700 text-white" : "text-gray-300"
                    }`}
                    onClick={() => handleNavigate("/createevent")}
                  >
                    Create Event
                  </div>
                )}
              </Menu.Item> */}
            </Menu.Items>
          </Menu>

        <NavLink to='/profile'  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-4xl'>
            <PermIdentityOutlinedIcon fontSize='inherit'/>
          </div>
          {/* <p className='text-xs sm:text-md md:text-lg '>Profile</p> */}
        </div>
        </NavLink>
    </div>
    </div>
    </div>
  )
}

export default NewUserFooter