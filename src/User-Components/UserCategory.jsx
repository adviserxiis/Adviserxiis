import { CircularProgress, Rating } from '@mui/material'
import React, { useEffect, useState } from 'react'
import insta from '../user-assets/insta.png'
import fb from '../user-assets/fb.png'
import twitter from '../user-assets/twitter.png'
import checkicon from '../user-assets/checkicon.png'
import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { useNavigate } from 'react-router-dom'
import User from '../assets/User.png'

const Categories= ["Career", "Business", "Health", "Technology", "Education", "Legal", "Marketing"]

function UserCategory() {
  const database = getDatabase(app);
  const navigate = useNavigate()

  const [advisers, setAdvisers] = useState([])
  const [loading, setLoading] = useState(true)

  async function getAllAdvisers() {
    const nodeRef = ref(database, 'advisers');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const advisers = [];
        snapshot.forEach(childSnapshot => {
          advisers.push({data:childSnapshot.val(),id:childSnapshot.key});
        });
        return advisers;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }



  useEffect(() => {
      getAllAdvisers().then((advisersData) => {
        setAdvisers(advisersData)
        setLoading(false); // Update loading state after fetching the user data
      });

  }, []);


  const handleClick = (adviserId) =>{
        navigate(`/category/${adviserId}`)
  }




  if (loading) {
    return <div className='h-screen flex justify-center items-center'><CircularProgress  /></div>; // Show a loading message or spinner while fetching data
  }



  return (
    <div className="min-h-screen flex flex-col font-inter pt-[80px]">

    <div className="flex-grow bg-gray-50 py-8">
      <section className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Categories</h1>
        <div className="flex flex-wrap space-x-2 md:space-x-8 space-y-1 mb-6">
          {Categories.map((category) => (
            <button key={category} className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
              {category}
            </button>
          ))}
        </div>
        <div className="relative mb-8  md:w-3/6 ">
          <input
            type="text"
            className="w-full p-3 h-16 rounded-lg shadow text-black"
            placeholder="Search consultant"
          />
          <button className="absolute right-0 top-0 mt-2 mr-2 bg-[#1C91F2] text-white px-4 p-3 rounded-lg">
            Search
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 '>
           
           {advisers.map((adviser, idx) => (

<div className="bg-white rounded-lg shadow p-4 px-[20px] flex cursor-pointer" key={idx}  onClick={()=> handleClick(adviser.id)}>
<div className='w-2/6 sm:w-1/5 flex flex-col justify-center items-center'>
<img
  src={adviser && adviser.data.profile_photo ? adviser.data.profile_photo : User }
  alt=""
  className="rounded-full h-28 w-28 object-cover my-[10px]"
/>

<div>
{/* <Rating name="read-only" value={5} readOnly /> */}
</div>
{/* <p className='text-center text-sm'>English, Hindi</p> */}
{/* <p className='text-center text-sm'>₹ 5/min</p> */}
</div>
<div className="w-4/6 sm:w-4/5 ml-4 mt-[10px] ">
  <div>
  <h2 className="text-2xl font-bold mt-[10px] mb-[8px]">{adviser.data.username}</h2>
  </div>
  
  <div className='flex justify-between' >
  <p className="text-md ">{adviser.data.professional_title}</p>
  <p className="text-md">Exp: <span>{adviser.data.years_of_experience
  }</span> years</p>
  </div>

  <p className='text-gray-500 text-sm sm:text-md' >{adviser.data.professional_bio }</p>
</div>
</div>

           ))}




        </div>

      </section>
    </div>
    <footer className="bg-white py-4">
      <div className="container mx-auto px-4 text-center my-[20px]">
        <div className="flex justify-between space-x-4 mb-4">
          <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Contact</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Terms</a>
          <a href="#" className="text-gray-600 hover:text-gray-800">Help</a>
        </div>
        <div className="flex justify-center space-x-4 md:space-x-8">
          <a href="#" >
          <img
            src={insta}
            alt=""
            className="h-8 w-8"
          />
          </a>
          <a href="#" >
          <img
            src={fb}
            alt=""
            className="h-8 w-8"
          />
          </a>
          <a href="#" >
          <img
            src={twitter}
            alt=""
            className="h-8 w-8"
          />
          </a>
        </div>
      </div>
    </footer>
  </div>
  )
}

export default UserCategory