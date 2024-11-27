import React, { useEffect, useState } from 'react'
import LargeCustomVideo from './LargeCustomVideo'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import User from '../assets/User.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShareDialog from './ShareDialog';

function CustomVideoCard({ post }) {

  const [liked, setLiked] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareURL, setShareURL] = useState('')


  const userid = JSON.parse(localStorage.getItem('userid'));
  const navigate = useNavigate()


  useEffect(() => {
    if (post?.data?.likes?.includes(userid)) {
      setLiked(true)
    }

    if (post?.adviser?.data?.followers?.includes(userid)) {
      setFollowed(true)
    }
  }, [])

  const addLike = async (postid) => {

    if (userid == null) {
      navigate('/createaccount');
      return;
    }

    try {
      const response = await axios.post('https://adviserxiis-backend-three.vercel.app/post/addlike', {
        userid,
        postid
      });

      if (response.status === 200) {
        setLiked(true)
        // console.log(response.data.message); // "Post liked successfully"
      }
    } catch (error) {

      console.error('Error liking the post:', error);
    }

  }


  const removeLike = async (postid) => {
    if (userid == null) {
      navigate('/createaccount');
      return;
    }

    try {
      const response = await axios.post('https://adviserxiis-backend-three.vercel.app/post/removelike', {
        userid,
        postid
      });

      if (response.status === 200) {
        setLiked(false)
        // console.log(response.data.message); // "Post liked successfully"
      }
    } catch (error) {

      console.error('Error liking the post:', error);
    }
  }

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handleShareClick = (postid) => {
    const url = `https://www.adviserxiis.com/post/${postid}`
    setShareURL(url);
    setShareDialogOpen(true);
  };


  const followHandler = async (adviserid) => {
    if (userid == null) {
      navigate('/createaccount');
      return;
    }

    try {
      const response = await axios.post('https://adviserxiis-backend-three.vercel.app/creator/followcreator', {
        adviserid: adviserid,
        followerid: userid
      });

      if (response.status === 200) {
        setFollowed(true)
        // console.log(response.data.message);
      }
    } catch (error) {

      console.error('Error following creator:', error);
    }

  }


  const unFollowHandler = async (adviserid) => {
    if (userid == null) {
      navigate('/createaccount');
      return;
    }

    try {
      const response = await axios.post('https://adviserxiis-backend-three.vercel.app/creator/unfollowcreator', {
        adviserid: adviserid,
        followerid: userid
      });

      if (response.status === 200) {
        setFollowed(false)
        // console.log(response.data.message);
      }
    } catch (error) {

      console.error('Error unfollowing creator:', error);
    }

  }



  return (
    <div className='font-Poppins'>
      <div className="flex justify-between items-center max-w-[600px] py-4 text-white mx-auto ">
        <div className="flex items-center">
          <img src={post?.adviser?.data?.profile_photo || User} alt="Profile" className="w-12 h-12 rounded-full mr-2" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">{post?.adviser?.data?.username || ''}</span>
            <span className="text-sm">{post?.adviser?.data?.professional_title || ''}</span>
          </div>
        </div>

        <div>
          {followed ? <button className="bg-[#3184FE] text-white px-4 py-1 rounded-xl" onClick={()=>unFollowHandler(post?.adviser?.id)}>
            Following
          </button> : <button className="bg-[#3184FE] text-white px-4 py-1 rounded-xl" onClick={() => followHandler(post?.adviser?.id)}>
            Follow
          </button>}
          {/* <button className="bg-[#3184FE] text-white px-4 py-1 rounded-xl">
            Follow
          </button> */}
        </div>
      </div>
      <div className="w-full max-w-[600px] h-[700px] mx-auto space-y-4">
        <LargeCustomVideo
          data={post}
        // addLike={addLikeOptimistically}
        // removeLike={removeLikeOptimistically}
        />

      </div>
      <div className="flex justify-between items-center max-w-[600px] py-4 text-white mx-auto">
        <div className="flex">
          <div className="flex flex-col items-center mr-4">
            {liked ? <div className="cursor-pointer ">
              <FavoriteIcon className='text-red-500' onClick={() => removeLike(post?.id)} />
            </div> : <div className="cursor-pointer ">
              <FavoriteBorderIcon className='text-white' onClick={() => addLike(post?.id)} />
            </div>}
            <p>{post?.data && post?.data?.likes ? post.data.likes.length : 0}</p>
          </div>

          <div className="ml-4 cursor-pointer">
            <ShareIcon onClick={() => handleShareClick(post?.id)} />
          </div>
          <ShareDialog
            open={shareDialogOpen}
            handleClose={handleShareDialogClose}
            url={shareURL}
          />
        </div>
      </div>
    </div>



  )
}

export default CustomVideoCard