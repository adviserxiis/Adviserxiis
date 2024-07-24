import React, { useRef, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import User from '../assets/User.png'
import ShareDialog from './ShareDialog';
import { useNavigate } from 'react-router-dom';

const CustomVideo = ({data, addLike, removeLike}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareURL, setShareURL] = useState('')

  const userid = JSON.parse(localStorage.getItem('userid'));
  const navigate = useNavigate()

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 1000); // Hide icon after 1 second
  };

  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
  };

  const handleShareClick = (postid) => {
    const url = `https://www.adviserxiis.com/post/${postid}`
    setShareURL(url);
    setShareDialogOpen(true);
  };

  const handleMuteClick = (e) => {
    e.stopPropagation(); // Prevent the video from toggling play/pause
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 1000); // Hide icon after 1 second
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleClickOnProfile = ( adviserName, adviserId) =>{
      
    navigate(`/category/${adviserName}`, {
      state: {
        adviserid: adviserId,
        advisername: adviserName
      }
    })
  
     }



  return (
    <div className="relative  h-screen w-screen  sm:h-full sm:w-full font-Poppins">
      <video
        ref={videoRef}
        src={data.data.post_file}
        autoPlay
        loop
        muted={isMuted}
        className="w-full h-full object-cover"
        onClick={handleVideoClick}
      >
        Your browser does not support the video tag.
      </video>
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl z-20">
          {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
        </div>
      )}
      <div className="absolute bottom-44 sm:bottom-36 right-4 text-white text-3xl md:text-4xl  cursor-pointer z-30" onClick={handleMuteClick}>
        {isMuted ? <VolumeOffIcon fontSize="inherit" /> : <VolumeUpIcon fontSize="inherit" />}
      </div>
      <div className="absolute bottom-56 sm:bottom-48 right-4 flex flex-col  items-center space-y-2  z-30">
        <div  className=" flex flex-col items-center cursor-pointer">
          {/* {isLiked ? <FavoriteIcon className="text-red-500" fontSize='large' /> : <FavoriteBorderIcon className="text-white" fontSize='large' />} */}
          {data.data && data.data.likes && data.data.likes.includes(userid) ? <div className="cursor-pointer text-3xl md:text-3xl lg:text-4xl ">
                    <FavoriteIcon className='text-red-500' fontSize="inherit" onClick={() => removeLike(data?.id)} />
                  </div> : <div className="cursor-pointer text-3xl md:text-4xl ">
                    <FavoriteBorderIcon className='text-white' fontSize="inherit" onClick={() => addLike(data?.id)} />
                  </div>}
                  <p className='text-white text-lg md:text-xl font-semibold'>{data?.data && data?.data?.likes ? data.data.likes.length : 0}</p>
        </div>
        <div onClick={()=>handleShareClick(data?.id)} className="cursor-pointer text-white text-3xl md:text-4xl ">
          <ShareIcon fontSize='inherit'/>
        </div>
      </div>
      <div className="absolute bottom-32 sm:bottom-20 left-0 w-full p-4  text-white">
        <div className="flex items-center mb-2 cursor-pointer" onClick={()=>handleClickOnProfile(data?.adviser?.data?.username, data?.adviser?.id)}>
          <img src={data?.adviser?.data?.profile_photo || User} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
          <span className="font-bold">{data?.adviser?.data?.username || ''}</span>
        </div>
        <div
          className={`cursor-pointer  ${isDescriptionExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}
          onClick={toggleDescription}
        >
          {data?.data?.description}
        </div>
      </div>
      <ShareDialog
                  open={shareDialogOpen}
                  handleClose={handleShareDialogClose}
                  url={shareURL}
                />
    </div>
  );
};

export default CustomVideo;
