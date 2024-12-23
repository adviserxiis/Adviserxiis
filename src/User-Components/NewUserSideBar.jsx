import React, { Fragment, forwardRef, useState } from "react";
import { HomeIcon, CreditCardIcon, UserIcon, ChevronDownIcon, PencilIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import { Link, NavLink, useNavigate } from "react-router-dom";
import new_logo from '../assets/new_logo.png'
import { Menu, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
// import AvailabilitySchedule from "./AvailabilitySchedule";
import { useMediaQuery } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import AddIcon from '@mui/icons-material/Add';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { SearchOffOutlined } from "@mui/icons-material";
import NewUploadReelDialog from "./NewUploadReelDialog";
import NewCreatePostDialog from "./NewCreatePostDialog";

const NewUserSideBar = forwardRef(({ showSideBar,handleOpen, setShowSideBar }, ref) => {
  const navigate = useNavigate()
  // const [dialogOpen, setDialogOpen] = useState(false);
  const [createReelOpen, setCreateReelOpen] = useState(false)
  const [createPostOpen, setCreatePostOpen] = useState(false)

  const matches = useMediaQuery('(max-width:1024px)'); 
  const userid = JSON.parse(localStorage.getItem('userid'));

  const handleLinkClick = () => {
    if (matches) {
      setShowSideBar(false); // Set sidebar to false only on mobile devices
    }
  };

  const handleLogOut = async () => {
    handleLinkClick()
    Swal.fire({
      title: "Do you want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("adviserid", JSON.stringify(null));
        navigate('/adviser');
      }
    });

  };

  const handleClickOnCalender = () =>{
      handleLinkClick();
      handleOpen();
  }


  const handleClickOnCreate = () => {
    navigate('/uploadreel')
    // if (userid != null) {
    //   console.log("Redirecting to Sign In...");
    //   navigate('/signin'); // Navigate to sign-in if user is not logged in
    // } else {
    //   console.log("Redirecting to Upload Reel...");
    //   navigate('/uploadreel'); // Navigate to upload reel if user is logged in
    // }
  };

  const handleCloseCreateReelDialog = () => {
    setCreateReelOpen(false);
};

const handleCloseCreatePostDialog = () => {
  setCreatePostOpen(false);
};

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
    <div ref={ref} className="fixed w-[300px] h-full bg-[#121212] border-r border-r-gray-500">
            <div className="flex  ">
            <div className='flex items-center justify-center pl-[50px] mt-[70px]  lg:mb-[20px] '>
              <Link to='/adviser' className="cursor-pointer">
              <img className="w-36" src={new_logo} alt="" />
              </Link>
          
        </div>
      </div>
      <div className="  h-full rounded-tr-[100px]">


      <div className="flex flex-col pt-[40px] pl-[30px]">

        <NavLink
          to="/"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins "
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl " style={{fontSize:"20px"}}><span className="mr-2"><HomeOutlinedIcon fontSize="medium" /></span>Home</p>
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/searchcreator"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}><span className="mr-2"><SearchIcon fontSize="medium" /></span>Search</p>
            </div>
          </div>
        </NavLink>

        <NavLink
          to="/reels"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}><span className="mr-2"><PlayArrowOutlinedIcon fontSize="medium" /></span>Reels</p>
            </div>
          </div>
        </NavLink>

        {/* <NavLink
           to="/uploadreel"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleClickOnCreate}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}><span className="mr-2"><AddIcon fontSize="medium" /></span>Create</p>
            </div>
          </div>
        </NavLink> */}
          <Menu as="div" className="relative pl-6 py-3 mx-5 mb-3">
            <Menu.Button className="w-full flex items-center justify-between text-left rounded cursor-pointer transition-colors text-gray-300 hover:text-white">
              <p className="font-Poppins font-2xl text-[20px] flex items-center">
                <span className="mr-2">
                  <AddIcon fontSize="medium" />
                </span>
                Create
              </p>
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-[200px] bg-gray-800 rounded shadow-lg">
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

        <NewUploadReelDialog open={createReelOpen} handleClose={handleCloseCreateReelDialog} />

        <NewCreatePostDialog open={createPostOpen} handleClose={handleCloseCreatePostDialog} />

  





        <NavLink
          to="/profile"
          className={({ isActive }) =>
            ` ${
              isActive
                ? " text-white font-Poppins"
                : "text-gray-300 hover:text-white font-Poppins"
            } `
          }
          onClick={handleLinkClick}
        >
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors`}
          >

            <div>
              <p className="font-Poppins font-2xl" style={{fontSize:"20px"}}><span className="mr-2"><PermIdentityOutlinedIcon fontSize="medium" /></span>Profile</p>
            </div>
          </div>
        </NavLink>






      </div>
    </div>



    </div>
  );
});

export default NewUserSideBar;
