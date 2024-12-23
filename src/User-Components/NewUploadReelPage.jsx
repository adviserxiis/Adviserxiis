import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NewUploadReelPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const userid = JSON.parse(localStorage.getItem('userid'));

  useEffect(()=>{
    const userid = JSON.parse(localStorage.getItem('userid'));
    if(userid == null)
    {
      navigate("/signin")
    }
  },[])

  Yup.addMethod(Yup.mixed, 'aspectRatio', function (ratio, message) {
    return this.test('aspect-ratio', message, async (value) => {
      if (!value) return true;
  
      const video = document.createElement('video');
      video.src = URL.createObjectURL(value);
  
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          const videoAspectRatio = video.videoWidth / video.videoHeight;
          const [expectedWidth, expectedHeight] = ratio.split(':').map(Number);
          const expectedAspectRatio = expectedWidth / expectedHeight;
  
          resolve(Math.abs(videoAspectRatio - expectedAspectRatio) < 0.01); // Tolerance for floating-point errors
        };
      });
    });
  });

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
      video: null,
      caption: "",
      location: "",
      hashtags: ""
    },
    validationSchema: Yup.object({
      video: Yup.mixed()
      .required('File is required')
      .test('fileType', 'Unsupported file type', (value) => {
        if (!value) return false; // File is required, so no file should be an error
        return value.type.startsWith('video/');
      })

      .test('fileDuration', 'Video must not be more than 60 seconds', async (value) => {
        if (!value) return true;
        const video = document.createElement('video');
        video.src = URL.createObjectURL(value);
        return new Promise((resolve) => {
          video.onloadedmetadata = () => {
            resolve(video.duration <= 60);
          };
        });
      })
      .aspectRatio('9:16', 'Video must have an aspect ratio of 9:16')
      .required('Video is required'),

    caption: Yup.string()
      .required('Caption is required')
      .min(3, 'Caption must be at least 3 characters long'),

    hashtags: Yup.string()
      .required('Luitags are required')
      .matches(/^#(\w+)(\s#(\w+))*$/, 'Hashtags must be space-separated and start with #')
    }),    

    onSubmit: async (values) => {
      // console.log("values", values)
      try {
        setLoading(true)
        const fileUri = selectedVideo; // Local URL for the selected video
        // const fileName = values.video.name;
        const currentTime = new Date();
        const fileName = `video_${currentTime.getTime()}.mp4`; 
        const apiKey = 'de112415-60af-446e-b3f795dec87a-222e-4dfb'; // Bunny.net API key
        const storageZoneName = 'luink-ai'; // Bunny.net storage zone name
        const storageUrl = `https://storage.bunnycdn.com/${storageZoneName}/${fileName}`;
        const accessUrl = `https://myluinkai.b-cdn.net/${fileName}`;

        const duration = await getVideoDuration(values.video);
        console.log("duration", duration)

        // Upload to Bunny.net
        const uploadResponse = await fetch(storageUrl, {
          method: 'PUT',
          headers: {
            AccessKey: apiKey,
            'Content-Type': 'application/octet-stream',
          },
          body: values.video,
        });

        if (uploadResponse.ok) {
          console.log('Video successfully uploaded to Bunny.net', uploadResponse);
          const videoURL = accessUrl;
          console.log("video Url", videoURL)

          // Save metadata to the database
          const postResponse = await fetch(
            'https://adviserxiis-backend-three.vercel.app/post/createpost',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                adviserid: userid, // Replace with actual user ID
                videoURL,
                fileType: 'video',
                location: values.location,
                description: values.caption,
                duration: Math.round(duration), // Replace with actual video duration
                luitags: values.hashtags,
              }),
            }
          );

          const jsonResponse = await postResponse.json();
          console.log('Post created successfully:', jsonResponse, jsonResponse);
          setLoading(false);
        } else {
          console.error('Error uploading video to Bunny.net:', uploadResponse.statusText);
        }
      } catch (error) {
        console.error('Error in form submission:', error);
      }finally{
        setLoading(false)
      }
    },
  });

  const handleVideoUpload = async(event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("video", file);
    setSelectedVideo(URL.createObjectURL(file));
  };

      useEffect(()=>{
        if(!userid){
          navigate('/signin')
        }
      },[userid])


  return (
    <div className="bg-[#121212] text-white">
      <h1 className="text-2xl font-bold pt-6 sm:text-center mx-4">Create Reel</h1>
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center pb-24 font-Poppins">


        <form onSubmit={formik.handleSubmit} className="w-11/12 max-w-md space-y-4 mt-4">

          <Button
            variant="contained"
            color="primary"
            component="label"
            className="w-full py-2"
          >
            Upload Video
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoUpload}
              onClick={(e) => e.stopPropagation()}
            />
          </Button>
          {formik.errors.video && formik.touched.video && (
            <div className="text-red-500 text-sm">{formik.errors.video}</div>
          )}

          {/* Display selected video */}
          <div className="p-8">
            {selectedVideo && ( <div>
              <div className="flex justify-end cursor-pointer" onClick={()=>setSelectedVideo(null)}> <DeleteOutlineOutlinedIcon  className="text-red-500"/></div>
              <video
                src={selectedVideo}
                controls
                className="w-full h-auto mt-4 p-4"
              />
              </div>
            )}
          </div>



          <div className="mt-4">
            <input
              name="caption"
              value={formik.values.caption}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Write Caption..."
              className="w-full px-2 py-3 text-sm text-white placeholder-gray-400 bg-[#121212]  border-b border-b-gray-100 focus:outline-none "
            />
            {formik.touched.caption &&
              formik.errors.caption && (
                <p
                  style={{
                    fontSize: "13px",
                    padding: "",
                    color: "red",
                  }}
                >
                  {formik.errors.caption}
                </p>
              )}
          </div>



          <div className="mt-4">
            <input
              name="location"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Add location"
              className="w-full px-2 py-3 text-sm text-white placeholder-gray-400 bg-[#121212]  border-b border-b-gray-100 focus:outline-none "
            />
            {formik.touched.location &&
              formik.errors.location && (
                <p
                  style={{
                    fontSize: "13px",
                    padding: "",
                    color: "red",
                  }}
                >
                  {formik.errors.location}
                </p>
              )}
          </div>



          <div className="mt-4">
            <input
              name="hashtags"
              value={formik.values.hashtags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Add #luitags (#hashtags)"
              className="w-full px-2 py-3 text-sm text-white placeholder-gray-400 bg-[#121212]  border-b border-b-gray-100 focus:outline-none "
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
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full py-4"
            // disabled={loading}
          >
                      { !loading ? 'Upload Reel' : <CircularProgress  color="inherit"  fontSize="small" />}
          </Button>
        </form>

      </div>
    </div>
  );
}

export default NewUploadReelPage;
