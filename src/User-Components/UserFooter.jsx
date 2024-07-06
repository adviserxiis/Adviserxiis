import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import { NavLink } from 'react-router-dom';

function UserFooter() {
  return (
    <div className='container mx-auto font-Poppins'>
    <div className='w-full flex justify-between p-4 px-[20px]  lg:px-[40px] '>
        <NavLink to="/" exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''} >
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-5xl'>
            <HomeOutlinedIcon fontSize='inherit'/>
          </div>
          <p className=' text-md sm:text-lg md:text-xl '>Home</p>
        </div>
        </NavLink>

        <NavLink to="/category"  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
            <div className='text-2xl md:text-3xl lg:text-5xl'>
                <PeopleOutlineOutlinedIcon fontSize='inherit' />
            </div>
            <p className='text-md sm:text-lg md:text-xl '>Adviser</p>

        </div>
        </NavLink>

        <NavLink to='/bookedservices'  exact className={({ isActive }) => isActive ? 'text-[#407BFF]' : ''}>
        <div className='flex flex-col items-center'>
          <div className='text-2xl md:text-3xl lg:text-5xl'>
            <HeadsetMicOutlinedIcon fontSize='inherit'/>
          </div>
          <p className='text-md sm:text-lg md:text-xl '>History</p>
        </div>
        </NavLink>
    </div>
    </div>
    
  )
}

export default UserFooter