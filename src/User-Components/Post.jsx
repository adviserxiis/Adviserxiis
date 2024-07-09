import React, { useEffect, useState } from 'react'
import User from '../assets/User.png'
import { useNavigate, useParams } from 'react-router-dom'
import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { CircularProgress } from '@mui/material';


function Post() {
   
    const {postid } = useParams()
    const database = getDatabase(app);

    const [post, setPost] = useState(null)
    const [adviser,setAdviser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

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

      useEffect(()=>{

            getPost(postid).then((postData)=>{
                setPost(postData)
                getUser(postData.adviserid).then((adviserData)=>{
                   setAdviser(adviserData)
                })
                setLoading(false)
              })
      },[])

      useEffect(()=>{
        const userid = JSON.parse(localStorage.getItem('userid'))

        if(userid != null)
        {
            navigate('/',{
                state:{
                  specificpostid:postid
                }
              })
        }
        
      },[])

      if (loading) {
        return <div className='h-screen flex justify-center items-center'><CircularProgress  /></div>; // Show a loading message or spinner while fetching data
      }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-Poppins sm:pt-[80px] ">
    <main className="container mx-auto p-4 flex flex-col lg:flex-row bg-white rounded-lg md:shadow-lg">
      {/* Left side content */}
      <div className="flex-1 lg:mr-4 mb-4 lg:mb-0">
        <div className="w-full aspect-w-1 aspect-h-1 flex items-center justify-center">
          {/* <img
            src={post && post.post_photo ? post.post_photo : ''}
            alt="Post"
            className="w-96 h-96 sm:w-[500px] sm:h-[500px]  md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] object-cover"
          /> */}

{post.post_file && (
           post.file_type && post.file_type === 'video' ? (
              <video controls className="w-96 h-96 sm:w-[500px] sm:h-[500px]  md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] object-cover">
                <source src={post.post_file} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
                               <img
                  src={post && post.post_file ? post.post_file : ''}
                  alt="Post Image"
                  className="w-96 h-96 sm:w-[500px] sm:h-[500px]  md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] object-cover"
                /> 
            )
          )}
        </div>
      </div>

      {/* Right side content */}
      <div className="flex-1 p-4">
        <div className="flex items-center mb-4">
          <img
            src={adviser && adviser.profile_photo ? adviser.profile_photo: User}
            alt="Adviser"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{adviser && adviser.username ? adviser.username : ''}</h2>
            <p className="text-lg md:text-xl text-gray-600">{adviser && adviser.professional_title ? adviser.professional_title : ''}</p>
          </div>
        </div>
        <p className="text-gray-700 text-md ">{adviser && adviser.professional_bio ? adviser.professional_bio : ''}</p>
      </div>
    </main>
  </div>
  )
}

export default Post