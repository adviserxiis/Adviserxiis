import React, { useEffect, useState } from "react";
import { IconButton, Avatar } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import NewVideoCard from "./NewVideoCard";



const NewFeedPost = ({ post }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const userid = JSON.parse(localStorage.getItem('userid'));
    const [hasLiked, setHasLiked] = useState(post?.data?.likes?.includes(userid));
    // console.log("file_type", post?.data?.file_type)
    // console.log("file_type", post?.data?.post_file)
  
    const handleDotClick = (index) => {
      setCurrentIndex(index);
    };

    function getRelativeTime(postDateStr) {
      const postDate = new Date(postDateStr);
      const now = new Date();
      const diffInSeconds = Math.floor((now - postDate) / 1000);
    
      const secondsInMinute = 60;
      const secondsInHour = 3600;
      const secondsInDay = 86400;
    
      if (diffInSeconds < secondsInMinute) {
        return `${diffInSeconds} sec ago`;
      } else if (diffInSeconds < secondsInHour) {
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes} min ago`;
      } else if (diffInSeconds < secondsInDay) {
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours} hr ago`;
      } else if (diffInSeconds < secondsInDay * 2) {
        return "yesterday";
      } else {
        // Return the date in a readable format
        return postDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    }
    
    
  
    return (
      <div className="bg-[#121212] text-white   font-Poppins  sm:p-6  mb-4  mx-auto w-full md:w-2/3 lg:w-1/2 border-b border-gray-500 ">
        <div className="flex items-center mb-4">
          <Avatar src={post?.adviser?.data?.profile_photo} alt="Profile"   sx={{ width: 56, height: 56 }}/>
          <div className="ml-4 text-white">
            <h2 className="font-semibold">{post?.adviser?.data?.username}</h2>
            <p className="text-gray-400">{post?.adviser?.data?.professional_title}</p>
            <p className="text-gray-400 text-sm">{getRelativeTime(post?.data?.dop)}</p>
          </div>
        </div>
                {/* Post Description */}
                <div className="text-gray-300 my-2">
            
          <p className="break-words">{post?.data?.description}</p>
          <div className="text-blue-400 mt-1">
            {/* {post.tags.map((tag, index) => (
              <span key={index} className="mr-2">
                {tag}
              </span>
            ))} */}
         
            <p className="break-words">{post?.data?.luitags}</p>
          </div>
        </div>
  
        {/* Render content based on type */}
        {post?.data?.file_type === 'text' ? (
          <p className="text-gray-300 mb-4">{post.description}</p>
        ) : (
          <div className="relative">
            <div className="bg-gray-600">
            {/* Render media item based on currentIndex */}
            {/* {post?.data?.file_type === 'long_video' ? (
              <video
                src={post?.data?.post_file[currentIndex]}
                controls
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            ) : (
              <img
                src={post?.data?.post_file[currentIndex]}
                alt="Post media"
                className="w-full max-h-[500px] object-contain rounded-lg"
              />
            )} */}

{post?.data?.file_type === 'long_video' ? (
  // <video
  //   src={Array.isArray(post?.data?.post_file) ? post?.data?.post_file?.[currentIndex]?.video_url : post?.data?.post_file}
  //   controls
  //   className="w-full max-h-[500px] object-cover rounded-lg"
  // />
  <NewVideoCard src={Array.isArray(post?.data?.post_file) ? post?.data?.post_file?.[currentIndex]?.video_url : post?.data?.post_file} />
) : (
  <img
    src={Array.isArray(post?.data?.post_file) ? post?.data?.post_file[currentIndex] : post?.data?.post_file}
    alt="Post media"
    className="w-full max-h-[500px] object-contain rounded-lg"
  />
)}
            </div>
  
            {/* Dot Navigation */}
            {/* {post?.data?.post_file?.length > 1 && (
              <div className="flex justify-center mt-2">
                {post.data.post_file.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
                      index === currentIndex ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            )} */}

{Array.isArray(post?.data?.post_file) && post.data.post_file.length > 1 && (
  <div className="flex justify-center mt-2">
    {post.data.post_file.map((_, index) => (
      <div
        key={index}
        onClick={() => handleDotClick(index)}
        className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
          index === currentIndex ? 'bg-blue-500' : 'bg-gray-500'
        }`}
      />
    ))}
  </div>
)}
          </div>
        )}
  

  
        {/* Post Actions */}
        <div className="flex justify-between mt-4 text-gray-400">
          <div className="flex justify-between text-white w-full">
            <div className="flex space-x-4">
            <IconButton>
                <div className="text-white flex items-center">
                {
                  hasLiked ?   <FavoriteIcon className="text-red-500" />   : <FavoriteBorderIcon className="text-white" />
                }
                
                <p className="text-sm pl-1">{post?.data?.likes?.length|| 0}</p>
                </div>
         
            </IconButton>
            <IconButton>
                <div className="text-white flex items-center">
              <ChatBubbleOutlineIcon className="text-white" />
              <p className="text-sm pl-1">{post?.data?.comments?.length|| 0}</p>
              </div>
            </IconButton>
            </div>
            <IconButton>
                <div className="text-white">
                <ShareIcon  className="text-white"/>
                </div>
     
            </IconButton>
          </div>

        </div>
      </div>
    );
  };


  export default NewFeedPost

