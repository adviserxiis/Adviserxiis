import React, { useState } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { child, get, getDatabase, ref, set, update } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { getDownloadURL, getStorage, uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { ref as sRef } from 'firebase/storage';
import { CircularProgress } from '@mui/material';
import { getAuth } from 'firebase/auth';

function CreatePost() {

    const database = getDatabase(app);
    const auth= getAuth();
    const [loading, setLoading] = useState(false)

    const adviserid = JSON.parse(localStorage.getItem('adviserid'))



    const initialValues = {
        post_file:null,

    }

    const validationSchema = Yup.object().shape({
        post_file: Yup
        .mixed()
        .test("fileType", "Unsupported file type", (value) => {
          if (!value) return true;
          const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4", "video/avi"];
          return allowedTypes.includes(value.type);
        })
        .test("fileSize", "File size is too large (max 5MB)", (value) => {
          if (!value) return true;
          return value.size <= 50 * 1024 * 1024; // 10MB in bytes
        })
        .required("file is required"),
     });

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

     const handleSubmit = async () =>{
        setLoading(true);
        const userid = JSON.parse(localStorage.getItem('adviserid'));
        const storage = getStorage();
        const { post_file} = formik.values;
        const date = new Date().toString(); 

        try {
            let postFileURL = null;
            let fileType = null;
        
            if (post_file) {
              const fileRef = sRef(storage, `posts/${uuidv1()}`);
              const uploadResult = await uploadBytes(fileRef, post_file);
              postFileURL = await getDownloadURL(uploadResult.ref);
              fileType = post_file.type.startsWith('video/') ? 'video' : 'image';
            }
        
            // const updateData = {
            //   username: name,
            //   professional_bio: professional_bio,
            // };
            const postid = uuidv1();
        
                await set(ref(database, 'advisers_posts/' +postid), {
                    adviserid:adviserid,
                    post_file:postFileURL,
                    file_type: fileType,
                    dop:date,
                    likes:[],
                  });

                  const adviserData = await getUser(adviserid)
                  const currentPosts = adviserData.posts || []; // Retrieve existing IDs or initialize to an empty array
                
                  // Add the new ID to the array
                  const updatedPosts = [...currentPosts, postid];
                
                  // Update the array field in the database
                  await update(ref(database, 'advisers/' + adviserid), { posts: updatedPosts });

      
        
            await Swal.fire({
              title: "Success",
              text: "Post Created Successfully!!",
              icon: "success",
            });
          } catch (error) {
            console.log("Error", error)
            await Swal.fire({
              title: "Error",
              text: "Something Went Wrong!!",
              icon: "error",
            });
          } finally {
            setLoading(false)
          }
     }

     const formik = useFormik({
            initialValues: initialValues,
            validationSchema: validationSchema,
            onSubmit: handleSubmit
        })



  return (
    <div className="flex flex-col pt-0 py-6 px-2 sm:p-6 ">
    <p className='font-Poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold s my-2'>Create Post</p>


    <form className="bg-[#D9D9D942] p-6 rounded-xl shadow-md space-y-6 md:w-4/6 lg:3/6 pb-[200px] mt-[60px]">


      <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 font-Poppins">Select Image or video to Post</label>

                            <div className='my-4'>
                                <label class="block">
                                    <span class="sr-only">Choose Post</span>
                                    <input type="file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                        name="post_file"
                                        onChange={(event) => {
                                            formik.setFieldValue("post_file", event.target.files[0]);
                                        }}
                                    />
                                </label>
                                {formik.touched.post_file &&
                                    formik.errors.post_file && (
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                padding: "",
                                                color: "red",
                                            }}
                                        >
                                            {formik.errors.post_file}
                                        </p>
                                    )}
                            </div>
                        </div>
 
      <div className="flex space-x-4">
        <button type="submit" className="bg-[#489CFF] text-white rounded-md py-2 px-4" onClick={formik.handleSubmit} disabled={loading}>
        { !loading ? 'Create Post' : <CircularProgress  color="inherit"  />}
        </button>
      </div>
    </form>
  </div>
  )
}

export default CreatePost