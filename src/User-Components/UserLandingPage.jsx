import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";
import bg1 from "../user-assets/bg1.png";
import icon1 from "../user-assets/icon1.png";
import icon2 from "../user-assets/icon2.png";
import icon3 from "../user-assets/icon3.png";
import image1 from "../user-assets/image1.png";
import image2 from "../user-assets/image2.png";
import image3 from "../user-assets/image3.png";
import image4 from "../user-assets/image4.png";
import bg2 from "../user-assets/bg2.jpeg";
import insta1 from '../user-assets/insta1.png'
import fb1 from '../user-assets/fb1.png'
import linkedin1 from '../user-assets/linkedin1.png'
import { useNavigate } from "react-router-dom";
import User from '../assets/User.png'
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress, useStepContext } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ShareIcon from '@mui/icons-material/Share';
import VideocamIcon from '@mui/icons-material/Videocam';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function UserLandingPage() {
  const database = getDatabase(app);

  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [updated, setUpdated] = useState(false) // state for  re rendering after like changes
  const userid = JSON.parse(localStorage.getItem('userid'));

  async function getAllPost() {
    const nodeRef = ref(database, 'advisers_posts');
    try {
      const snapshot = await get(nodeRef);
      if (snapshot.exists()) {
        const posts = [];
        snapshot.forEach(childSnapshot => {
          posts.push({ data: childSnapshot.val(), id: childSnapshot.key });
        });
        return posts;
      } else {
        console.log('No data available');
        return [];
      }
    } catch (error) {
      console.error('Error fetching node details:', error);
      return [];
    }
  }

  const fetchServiceById = async (serviceId) => {
    const serviceRef = ref(database, `advisers_service/${serviceId}`);
    try {
      const snapshot = await get(serviceRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log(`No service available for service ID: ${serviceId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching service data for service ID: ${serviceId}`, error);
      return null;
    }
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

  async function getPost(postid) {
    const nodeRef = ref(database, `advisers_posts/${postid}`);
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


  const addLike = async (postid) =>{
 
      if(userid == null)
      {
        return
      }
    const postData = await getPost(postid)
    const currentLikes = postData.likes || []; // Retrieve existing IDs or initialize to an empty array
  
    // Add the new ID to the array
    const updatedLikes = [...currentLikes, userid];
  
    // Update the array field in the database
    await update(ref(database, 'advisers_posts/' + postid), { likes : updatedLikes });
    setUpdated(!update)
  }

  const removeLike = async (postid) =>{
    if(userid == null)
    {
      return
    }
    const postData = await getPost(postid)
    const currentLikes = postData.likes || [];

    const updatedLikes = currentLikes.filter((id)=> id != userid)

    await update(ref(database, 'advisers_posts/' + postid), { likes : updatedLikes });
    setUpdated(!update)
  }


  useEffect(() => {
    getAllPost().then((response) => {
      setPosts(response)   
       setLoading(false)
    })
  },[updated])

  useEffect(() => {
    async function fetchAdviserAndServiceDetails() {
      const details = await Promise.all(
        posts.map(async (post) => {
          const adviser = await getUser(post.data.adviserid);
          let firstService = null;
          if (adviser && adviser.services && adviser.services.length > 0) {
            firstService = await fetchServiceById(adviser.services[0]);
          }
          return { ...post, adviser, firstService };
        })
      );
      setPosts(details);
    }

    fetchAdviserAndServiceDetails();
  }, [posts, updated]);

  if (loading) {
    return <div className='h-screen flex justify-center items-center'><CircularProgress  /></div>; // Show a loading message or spinner while fetching data
  }

  return (
    //     <div className="min-h-screen flex flex-col pt-[80px]">
    //       <div className=" container mx-auto flex-grow">
    //       <section className="relative bg-[#489CFF] text-white py-16 px-4 md:px-8">
    //   <div className="container mx-auto flex flex-col md:flex-row items-center">
    //     <div className="md:w-2/5 mt-[40px] md:mt-[100px]">
    //       <h1 className="text-4xl md:text-5xl font-bold mb-4 font-Poppins text-black">
    //         Get professional,<br /> advice from top experts
    //       </h1>
    //       <div className="relative">
    //         <input
    //           type="text"
    //           className="w-full p-3 h-16 rounded shadow text-black font-Poppins"
    //           placeholder="Search Adviser"
    //         />
    //         <button className="absolute right-0 top-0 my-2 mr-2 p-3 bg-[#489CFF] text-white rounded font-Poppins">
    //           Search
    //         </button>
    //       </div>
    //     </div>

    //     <div className="md:w-3/5 flex justify-center mt-8 md:mt-0 relative z-10">
    //       <img
    //         src={bg1}
    //         alt=""
    //         className="max-w-full h-auto md:translate-y-10 md:-translate-x-10"
    //       />
    //     </div>
    //   </div>
    // </section>
    //         <section className="bg-[#F2F2F24D] mt-4 rounded-lg py-16 px-4 md:px-8 font-Poppins">
    //           <div className="container mx-auto text-center md:mx-[50px]">
    //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //               <div>
    //                 <img src={icon1} alt="Advisers Icon" className="mx-auto my-4" />
    //                 <h2 className="text-3xl font-bold">1000 + Advisers</h2>
    //               </div>
    //               <div>
    //                 <img src={icon2} alt="Advice Icon" className="mx-auto my-4" />
    //                 <h2 className="text-3xl font-bold">700 + Advise Provided</h2>
    //               </div>
    //               <div>
    //                 <img src={icon3} alt="Users Icon" className="mx-auto my-4" />
    //                 <h2 className="text-3xl font-bold">800 + Users</h2>
    //               </div>
    //             </div>
    //           </div>
    //         </section>
    //         <section className=" py-16 px-4 md:px-8">
    //           <div className="container mx-auto font-Poppins">
    //             <div className="flex flex-col-reverse md:flex-row justify-center items-center">
    //               <div className="w-full md:w-3/5 mt-[60px]">
    //                 <h2 className="text-3xl font-bold mb-4">What is Adviserxiis</h2>
    //                 <p className="text-lg leading-loose">
    //                   Adverxiis is your one-stop platform for connecting with
    //                   <br />
    //                   professional advisers. Whether you need expert advice,
    //                   <br />
    //                   coaching, or consulting services, Adverxiis makes it easy to
    //                   find
    //                   <br />
    //                   and book the right adviser for you.
    //                 </p>
    //               </div>
    //               <div className="mx-4 w-full md:w-2/5 flex justify-center items-center">
    //                 <img src={image1} alt="" className="" />
    //               </div>
    //             </div>
    //           </div>
    //         </section>

    //         <div className="font-Poppins">
    //           <h2 className="text-3xl lg:text-4xl mb-[20px] font-bold my-4 text-center">Catergories</h2>

    //           <div className="my-4 ">
    //             <ul className=" grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:space-x-4 sm:justify-center md:space-x-12 sm:space-y-2 px-4">
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Dietitian
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   CA
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Fitness Coach
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Finance
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Funds
    //                 </a>
    //               </li>

    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Startups
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Tech
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Sports
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   branding
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   UI/UX
    //                 </a>
    //               </li>
    //               <li className="px-4 py-2 rounded-full bg-[#F3F3F3] text-lg font-semibold text-center">
    //                 <a href="/" className="">
    //                   Meditation
    //                 </a>
    //               </li>
    //             </ul>
    //           </div>
    //         </div>

    //         <div className="font-Poppins md:mt-[100px] mt-[50px]">
    //           <div>
    //             <h2 className="text-3xl lg:text-4xl md:mt-[100px] font-bold my-4 text-center">
    //               How it works
    //             </h2>
    //           </div>

    //           <div className="flex flex-col md:flex-row justify-between mt-[60px] lg:px-[200px]">
    //             <div className="flex flex-col">
    //               <img src={image2} alt="" className=" h-32 md:h-48 lg:h-56 " />

    //               <p className="text-3xl  my-4 text-center">Choose your Adviser</p>
    //             </div>
    //             <div className="flex flex-col">
    //               <img src={image3} alt="" className=" h-32 md:h-48 lg:h-56 " />

    //               <p className="text-3xl  my-4 text-center">Book Service</p>
    //             </div>

    //             <div className="flex flex-col">
    //               <img src={image4} alt="" className=" h-32 md:h-48 lg:h-56 " />

    //               <p className="text-3xl  my-4 text-center">Enjoy Service</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       <div
    //   className="relative h-[350px] md:h-[450px] bg-cover bg-center flex justify-center items-center font-Poppins mt-[100px]"
    //   style={{ backgroundImage: `url(${bg2})` }}
    // >
    //   <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-200" style={{ opacity: 0.5 }}></div>

    //   <div className="relative z-10">
    //     <p className="text-4xl lg:text-5xl font-bold text-white text-center">
    //       Now time to take professional Advise
    //     </p>
    //     <div className="flex justify-center">
    //       <button className="h-16 text-center px-[15px] text-white bg-[#407BFF] rounded-md mt-[20px] text-xl font-bold" onClick={()=>navigate('/category')}>
    //         Find Your adviser
    //       </button>
    //     </div>
    //   </div>
    // </div>

    //       <div className="text-white bg-[#407BFF] font-Poppins ">
    //         <div className="container mx-auto py-4 flex flex-col md:flex-row justify-between">
    //           <div className="flex justify-center items-center">
    //             <p className="text-xl text-center pb-2 sm:pb-0">Copyright © 2023. Advsierxiis</p>
    //           </div>
    //           <div className="flex justify-center ">
    //             <img src={insta1}
    //               alt=""
    //               className=" h-12 mx-2"

    //             />

    //             <img src={fb1}
    //               alt=""
    //               className=" h-12 mx-2"

    //             />

    //             <img src={linkedin1}
    //               alt=""
    //               className="h-12 mx-2"

    //             />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    

    <div className="min-h-screen pt-[80px]">
      <div className=" flex flex-col items-center container mx-auto md:mx-7xl  font-Poppin">
        <div className="m-4">
          { posts.map((post, idx)=>(
                      <div className="max-w-[900px] my-4" key={idx}>
                      <div className="flex items-center justify-between bg-[#5A88FF] p-4 rounded-tr-xl rounded-tl-xl">
                        <div className="flex items-center break-words">
                        <img
                          src={post.adviser?.profile_photo || User}
                          alt=""
                          className="rounded-full h-12 w-12 object-cover my-[10px]"
                        />
                        <p className="ml-2 text-white text-lg md:text-xl">{post.adviser?.username || 'Unknown Adviser'}</p>
                        </div>
                        <div className="flex items-center  bg-white text-[#5A88FF] px-4 py-2 rounded-md">
                          <p>{post.firstService?.price || 'N/A'}/hr</p>
                          <div className="ml-2">
                          <VideocamIcon fontSize="large" />
                          </div>
                          </div>
                      </div>
                      <div>
                        <img
                          src={post.data && post.data.post_photo ? post.data.post_photo : ''}
                          alt="Post Image"
                            className="w-96 h-96 sm:w-[500px] sm:h-[500px]  md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] object-cover"
                        />
                      </div>
                      <div className="flex  items-center bg-[#5A88FF] p-4 rounded-bl-xl rounded-br-xl">
                       
                        <div className="mx-2 flex justify-center">
                       <p className="text-3xl mr-1">{post.data && post.data.likes ? post.data.likes.length : 0}</p>

                       { post.data && post.data.likes && post.data.likes.includes(userid) ? <div className="cursor-pointer">
                        <ThumbUpIcon fontSize="large" onClick={()=>removeLike(post.id)} />
                         </div> : <div className="cursor-pointer">
                        <ThumbUpOffAltIcon fontSize="large" onClick={()=>addLike(post.id)} />
                        </div> }

                        </div>


                        <div className="mx-2 flex justify-center">
                          {/* <p className="text-3xl mr-1">0</p> */}
                        <ShareIcon fontSize="large" />
                        </div>
                      </div>
          
                    </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default UserLandingPage;
