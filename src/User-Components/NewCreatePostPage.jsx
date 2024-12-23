import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import User from '../assets/User.png'
import * as Yup from "yup";
import Profile from '../user-assets/Profile.png'
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NewVideoCard from "./NewVideoCard";

const NewCreatePostPage = () => {

    const navigate = useNavigate();
    const [postType, setPostType] = useState("Images");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading]= useState(false)
    const userid = JSON.parse(localStorage.getItem('userid'));
    const user = JSON.parse(localStorage.getItem('user'));


    const uploadVideoToBunny = async (video) => {
        const fileUri = video;
        const fileName = fileUri.name;
        const apiKey = "de112415-60af-446e-b3f795dec87a-222e-4dfb"; // Replace with your Bunny.net API key
        const storageZoneName = "luink-ai"; // Replace with your storage zone name
        const storageUrl = `https://storage.bunnycdn.com/${storageZoneName}/${fileName}`;
        const accessUrl = `https://myluinkai.b-cdn.net/${fileName}`;
    
        const response = await fetch(storageUrl, {
          method: "PUT",
          headers: {
            AccessKey: apiKey,
            "Content-Type": "application/octet-stream",
          },
          body: video,
        });
    
        if (!response.ok) {
          throw new Error("Failed to upload video to Bunny.net.");
        }
    
        return accessUrl;
      };

      const getVideoDuration = (file) => {
        return new Promise((resolve, reject) => {
          const video = document.createElement("video");
          video.src = URL.createObjectURL(file);
          video.onloadedmetadata = () => {
            resolve(video.duration); // Duration in seconds
            URL.revokeObjectURL(video.src); // Clean up object URL
          };
          video.onerror = (err) => reject(err);
        });
      };

    const formik = useFormik({
        initialValues: {
            text: "",
            files: [],
            hashtags: "",
        },
        validationSchema: Yup.object({
            text: Yup.string().max(1000, "Maximum 1000 characters allowed"),
            hashtags: Yup.string()
                .matches(/^#(\w+)(\s#(\w+))*$/, 'Hashtags must be space-separated and start with #')
        }),
        onSubmit: async (values) => {
            console.log("Post Data:", values);
            try {
                setLoading(true)
                let response;
        
                if (postType === "Images" && values.files.length > 0) {
                  const formData = new FormData();
                  values.files.forEach((file, index) => {
                    formData.append("images", file);
                  });
                  formData.append("adviserid", userid); // Replace with user ID
                  formData.append("luitags", values.hashtags);
                  if (values.text) formData.append("description", values.text);
        
                  response = await fetch(
                    "https://adviserxiis-backend-three.vercel.app/post/createimagepost",
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                } else if (postType === "Videos" && values.files.length > 0) {
                const videoURLs = [];
                const durations = [];
    
                await Promise.all(
                    values.files.map(async (video) => {
                        const videoURL = await uploadVideoToBunny(video); // Upload video to Bunny.net
                        const duration = await getVideoDuration(video); // Get video duration
                        videoURLs.push(videoURL);
                        durations.push(Math.round(duration));
                    })
                );
    
                response = await fetch(
                    "https://adviserxiis-backend-three.vercel.app/post/createvideopost",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            adviserid: userid,
                            videoURLs: videoURLs,
                            durations: durations,
                            description: values.text,
                            luitags: values.hashtags,
                        }),
                    }
                );
                } else {
                  response = await fetch(
                    "https://adviserxiis-backend-three.vercel.app/post/createtextpost",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        adviserid: userid, // Replace with user ID
                        message: values.text,
                        luitags: values.hashtags,
                      }),
                    }
                  );
                }
        
                if (!response.ok) {
                  const error = await response.text();
                  throw new Error(error || "Failed to create post");
                }
        
                const result = await response.json();
                console.log("Post created successfully:", result);
                // alert("Post created successfully!");
              } catch (error) {
                console.error("Error creating post:", error);
                alert("Failed to create post. Please try again.");
              } finally{
                setLoading(false)
                setSelectedFiles([])
                formik.setFieldValue("files", []);
                formik.setFieldValue("text", "");
                formik.setFieldValue("hashtags", "");
                navigate('/')
              }
        },
    });


    useEffect(()=>{
      if(!userid){
        navigate('/signin')
      }
    },[userid])

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        formik.setFieldValue("files", files);
    };

    return (
        <div className="bg-[#121212] text-white min-h-screen flex flex-col items-center font-Poppins ">
            {/* Header */}
            <div className="flex items-center w-full p-4  max-w-md">
                {/* <button className="text-lg font-semibold text-white mr-4">←</button> */}
                <h1 className="text-xl font-bold">Create Post</h1>
            </div>

            {/* Profile and Dropdown */}
            <div className="flex items-center justify-between w-full px-4 py-2 gap-4 max-w-md">
                <div className="flex items-center space-x-2">
                    <img
                        src={ user ? user.profile_photo : User} // Replace with your profile image
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-lg font-medium">{user ? user.username :'Username'}</span>
                </div>
                <div>
                    <select
                        className="bg-gray-700 text-white px-4 py-2 rounded border-none focus:outline-none"
                        value={postType}
                        onChange={(e) => setPostType(e.target.value)}
                    >
                        <option value="Images">Images</option>
                        <option value="Videos">Videos</option>
                    </select>
                </div>
            </div>

            {/* Media Preview */}
            <div className="flex flex-col items-center w-full p-4 max-w-md space-y-4">
                {/* Media Preview Area */}
                <div className="w-full rounded-md p-4">
                    {selectedFiles.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto">
                            {selectedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="w-36 h-36 sm:w-40 sm:h-40  bg-gray-700 rounded-md flex-shrink-0"
                                >
                                    {file.type.startsWith("image") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Selected"
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        // <video
                                        //     src={URL.createObjectURL(file)}
                                        //     controls
                                        //     className="w-full h-full object-cover rounded-md"
                                        // />
                                        <NewVideoCard src={URL.createObjectURL(file)} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Text Input */}
                <textarea
                    className="bg-[#121212] text-white p-4 rounded w-full resize-none focus:outline-none"
                    rows="5"
                    placeholder="Enter your post here..."
                    name="text"
                    onChange={formik.handleChange}
                    value={formik.values.text}
                />
                {formik.errors.text && (
                    <p className="text-red-500 text-sm">{formik.errors.text}</p>
                )}

                {/* Add Tags */}

            </div>

            {/* Bottom Section */}
            <div className="p-4 w-full flex  flex-col justify-between gap-4 max-w-md fixed bottom-16 ">
                {/* File Input */}
                <input
                    name="hashtags"
                    value={formik.values.hashtags}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    placeholder="Add Luitags"
                    className="bg-[#121212] text-white p-4 rounded w-full border-b focus:outline-none"
                />
                {formik.touched.hashtags &&
                    formik.errors.hashtags && (
                        <p
                            style={{
                                fontSize: "13px",
                                padding: "",
                                color: "red",
                            }}
                        >
                            {formik.errors.hashtags}
                        </p>
                    )}

                <div className="flex items-center justify-between">
                    <label
                        htmlFor="files"
                        className="text-blue-500 cursor-pointer flex items-center justify-center gap-2  p-2 rounded-md text-center"
                    >
                        {/* <i className="material-icons">add_photo_alternate</i> Select Images/Videos */}
                        <div>
                            <CollectionsOutlinedIcon />
                        </div>
                    </label>
                    <input
                        type="file"
                        id="files"
                        accept={postType === "Images" ? "image/*" : "video/*"}
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Post Button */}
                    <button
                        type="submit"
                        onClick={formik.handleSubmit}
                        className="bg-blue-500 text-white px-6 py-1 rounded-full text-lg  hover:bg-blue-600"
                        disabled={loading}
                    >
                        { !loading ? 'Post' : <CircularProgress  color="inherit"  fontSize="inherit" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewCreatePostPage;
