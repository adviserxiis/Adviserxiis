import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import User from '../assets/User.png'
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase";
import Swal from "sweetalert2";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CustomVideo from "./CustomVideo";
import UserLandingPageSkeleton from "../Skeletons/UserLandingPageSkeleton";
import axios from "axios";
import NewCustomVideo from "./NewCustomeVideo";
import LargeCustomVideo from "./LargeCustomVideo";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CustomVideoCard from "./CustomVideoCard";
import CommentIcon from '@mui/icons-material/Comment';
import { Avatar, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NewFeedPost from "./NewFeedPost";
import new_logo from '../assets/new_logo.png'

function NewUserHome() {
  const database = getDatabase(app);

  const navigate = useNavigate()
  const location = useLocation()

  const auth = getAuth()
  // const [posts, setPosts] = useState([])
  const [postsWithAdviser, setPostsWithAdviser] = useState([])
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [updated, setUpdated] = useState(false) // state for  re rendering after like changes
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
  const [shareURL, setShareURL] = useState('')
  const [questions, setQuestions] = useState([])

  const { specificpostid } = location.state || {}

  const userid = JSON.parse(localStorage.getItem('userid'));
  const adviserid = JSON.parse(localStorage.getItem('adviserid'));



  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };


  const handleQuestionDialogOpen = () => {
    setQuestionDialogOpen(false)
  }

  const handleShareClick = (postid) => {
    const url = `https://www.adviserxiis.com/post/${postid}`
    setShareURL(url);
    setShareDialogOpen(true);
  };

  const deletePost = async (postid) => {
    remove(ref(database, 'advisers_posts/' + postid));

    const adviserRef = ref(database, 'advisers/' + adviserid);
    const snapshot = await get(adviserRef);
    if (snapshot.exists()) {
      const adviserData = snapshot.val();
      const currentPosts = adviserData.posts || [];


      const updatedPosts = currentPosts.filter(id => id !== postid);



      await update(adviserRef, {
        posts: updatedPosts,
      });
    }

    setUpdated(prev => !prev)
  }

  const deleteHandler = async (postid) => {


    Swal.fire({
      title: "Do you want to delete this post?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(postid)
      }
    });


  }


  const handleClickOnProfile = (adviserName, adviserId) => {

    navigate(`/category/${adviserName}`, {
      state: {
        adviserid: adviserId,
        advisername: adviserName
      }
    })

  }


  // const posts = [
  //   {
  //     id: 1,
  //     type: 'image',
  //     media: ['https://firebasestorage.googleapis.com/v0/b/adviserxiis-920e5.appspot.com/o/posts%2Feff98a10-7349-11ef-a3ce-77d7974f08a2%2Feff98a10-7349-11ef-a3ce-77d7974f08a2_1726394686769_image0.jpg?alt=media&token=dc01a3bb-3fb8-4418-8d16-772833d64dd7', 'https://firebasestorage.googleapis.com/v0/b/adviserxiis-920e5.appspot.com/o/posts%2Feff98a10-7349-11ef-a3ce-77d7974f08a2%2Feff98a10-7349-11ef-a3ce-77d7974f08a2_1726394686784_image1.jpg?alt=media&token=c83607a6-3468-4f7e-a21f-02073bfb84ff', 'https://firebasestorage.googleapis.com/v0/b/adviserxiis-920e5.appspot.com/o/posts%2Feff98a10-7349-11ef-a3ce-77d7974f08a2%2Feff98a10-7349-11ef-a3ce-77d7974f08a2_1726394686785_image2.jpg?alt=media&token=f1d6c92f-73f5-47bb-9f61-3b7cd3fc771b'],
  //     description: 'A beautiful view of the park...',
  //     tags: ['#park', '#giantwheel', '#lights', '#fun'],
  //   },
  //   {
  //     id: 2,
  //     type: 'video',
  //     media: ['https://myluinkai.b-cdn.net/rn_image_picker_lib_temp_3ede73b6-15ce-4e1e-b350-71a1ceb2527d.mp4', 'https://myluinkai.b-cdn.net/rn_image_picker_lib_temp_97341423-4774-4756-8a18-72b6ed80d006.mp4'],
  //     description: 'Fun moments at the beach...',
  //     tags: ['#beach', '#sunset'],
  //   },
  //   {
  //     id: 3,
  //     type: 'text',
  //     description: ' Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.Just a simple text post with no media.',
  //     tags: ['#thoughts', '#inspiration'],
  //   },
  // ];



  const getPost = async () => {
    try {
      const response = await fetch(
        'https://adviserxiis-backend-three.vercel.app/post/getallposts',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const jsonResponse = await response.json();
      // console.log('Post Details', jsonResponse);
      setPosts(jsonResponse);
    } catch (error) {
      console.log('Hie');
      console.error('Error fetching video list:', error);
    }
  };

  useEffect(() => {
    getPost();
  }, [])



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://adviserxiis-backend-three.vercel.app/post/getallpostswithadviserdetails'); // Replace with your actual API endpoint
        setPostsWithAdviser(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://adviserxiis-backend-three.vercel.app/creator/getuser/${userid}`);
        const data = response.data;
        setUser(data)
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.log("Error in fetching user details", err);
      }
    };

    if (userid) {
      fetchUserDetails(); // Trigger API call if userId is available
    }
  }, [userid]);





  if (loading) {
    // return <div className='h-screen flex justify-center items-center'><CircularProgress /></div>; // Show a loading message or spinner while fetching data
    return <div>
      <UserLandingPageSkeleton />
    </div>
  }

  return (

    // <div className="min-h-screen  bg-[#121212]">
    //   <div className="flex flex-col items-center px-0 mx-auto font-Poppin ">
    //     <div className="mx-0 sm:mx-4 ">
    //       {postsWithAdviser.map((post, idx) => (
    //         <div className="" key={idx}>
    //           <div>
    //             <div className="lg:hidden w-screen h-screen ">
    //               <NewCustomVideo data={post}  />
    //             </div>


    //             <div className="hidden lg:block mx-auto">
    //               <CustomVideoCard post={post} />

    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>































    // <div className="flex justify-center bg-gray-900 text-white min-h-screen">
    //   <div className="w-full max-w-2xl p-4">
    //     {posts.map((post) => (
    //       <div key={post.id} className="bg-gray-800 rounded-lg p-4 mb-6">
    //         <div className="flex items-center mb-4">
    //           <img
    //             src={post.user.avatar}
    //             alt={post.user.name}
    //             className="w-10 h-10 rounded-full mr-3"
    //           />
    //           <div>
    //             <h2 className="font-semibold">{post.user.name}</h2>
    //             <p className="text-gray-400 text-sm">
    //               {post.user.role} • {post.user.time}
    //             </p>
    //           </div>
    //           <IconButton className="ml-auto">
    //             <MoreHorizIcon className="text-gray-400" />
    //           </IconButton>
    //         </div>

    //         {/* Post content */}
    //         <div className="relative mb-4">
    //           {post.content[currentIndex]?.type === 'image' && (
    //             <img
    //               src={post.content[currentIndex].src}
    //               alt=""
    //               className="w-full rounded-lg"
    //             />
    //           )}
    //           {post.content[currentIndex]?.type === 'video' && (
    //             <video
    //               src={post.content[currentIndex].src}
    //               controls
    //               className="w-full rounded-lg"
    //             />
    //           )}
    //           {post.content[currentIndex]?.type === 'text' && (
    //             <p className="text-gray-200 p-3 rounded-lg bg-gray-700">
    //               {post.content[currentIndex].text}
    //             </p>
    //           )}

    //           {/* Dots for navigation */}
    //           <div className="flex justify-center mt-2 space-x-1">
    //             {post.content.map((_, index) => (
    //               <div
    //                 key={index}
    //                 onClick={() => handleDotClick(index)}
    //                 className={`w-2.5 h-2.5 rounded-full ${
    //                   index === currentIndex ? 'bg-blue-500' : 'bg-gray-400'
    //                 } cursor-pointer`}
    //               ></div>
    //             ))}
    //           </div>
    //         </div>

    //         {/* Description and tags */}
    //         <p className="text-gray-300 mb-2">{post.description}</p>
    //         <div className="flex flex-wrap gap-2 mb-4">
    //           {post.tags.map((tag) => (
    //             <span key={tag} className="text-blue-500 text-sm">
    //               #{tag}
    //             </span>
    //           ))}
    //         </div>

    //         {/* Post actions */}
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-center space-x-4">
    //             <IconButton>
    //               <FavoriteBorderIcon className="text-white" />
    //             </IconButton>
    //             <IconButton>
    //               <ChatBubbleOutlineIcon className="text-white" />
    //             </IconButton>
    //             <IconButton>
    //               <ShareIcon className="text-white" />
    //             </IconButton>
    //           </div>
    //           <span className="text-gray-400 text-sm">{post.likes} Likes</span>
    //           <span className="text-gray-400 text-sm">{post.comments} Comments</span>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>


    <div className="bg-[#121212] min-h-screen w-screen sm:w-full">

      <div className="flex justify-between px-4 py-4 border-b  sm:hidden ">
        <img
          src={new_logo}
          alt=""
          className="h-8"
        />


        <Avatar src={user ? user.profile_photo : User} alt="Profile" />
      </div>
      <div className="flex flex-col items-center p-4 bg-[#121212]  pb-24 text-white  font-Poppins">


        {posts.map((post) => (
          <NewFeedPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default NewUserHome;
