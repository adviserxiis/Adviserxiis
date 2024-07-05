import React, { useState } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { child, get, getDatabase, ref, set } from "firebase/database";
import { app } from "../firebase";
import { v1 as uuidv1 } from 'uuid';
import { getDownloadURL, getStorage, uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { ref as sRef } from 'firebase/storage';
import { CircularProgress } from '@mui/material';

function CreatePost() {

    const database = getDatabase(app);
    const [loading, setLoading] = useState(false)

    const adviserid = JSON.parse(localStorage.getItem('adviserid'))

    const initialValues = {
        post_photo:null,

    }

    const validationSchema = Yup.object().shape({
        post_photo: Yup
        .mixed()
        .test("fileType", "Unsupported file type", (value) => {
          if (!value) return true;
          const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
          return allowedTypes.includes(value.type);
        })
        .test("fileSize", "File size is too large (max 5MB)", (value) => {
          if (!value) return true;
          return value.size <= 5 * 1024 * 1024; // 10MB in bytes
        })
        .required("Image is required"),
     });

     const handleSubmit = async () =>{
        setLoading(true);
        const userid = JSON.parse(localStorage.getItem('adviserid'));
        const storage = getStorage();
        const { post_photo} = formik.values;

        try {
            let postPhotoURL = null;
        
            if (post_photo) {
              const imgRef = sRef(storage, `posts/${uuidv1()}`);
              const uploadResult = await uploadBytes(imgRef, post_photo);
              postPhotoURL = await getDownloadURL(uploadResult.ref);
            }
        
            // const updateData = {
            //   username: name,
            //   professional_bio: professional_bio,
            // };
        
        
                await set(ref(database, 'advisers_posts/' +uuidv1()), {
                    adviserid:adviserid,
                    post_photo:postPhotoURL,
                    likes:[],
                  });

      
        
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
                            <label className="block text-sm font-bold text-gray-700 font-Poppins">Select Image to Post</label>

                            <div className='my-4'>
                                <label class="block">
                                    <span class="sr-only">Choose Post</span>
                                    <input type="file" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                        name="post_photo"
                                        onChange={(event) => {
                                            formik.setFieldValue("post_photo", event.target.files[0]);
                                        }}
                                    />
                                </label>
                                {formik.touched.post_photo &&
                                    formik.errors.post_photo && (
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                padding: "",
                                                color: "red",
                                            }}
                                        >
                                            {formik.errors.post_photo}
                                        </p>
                                    )}
                            </div>
                        </div>
 
      <div className="flex space-x-4">
        <button type="submit" className="bg-[#489CFF] text-white rounded-md py-2 px-4" onClick={formik.handleSubmit}>
        { !loading ? 'Create Post' : <CircularProgress  color="inherit"  />}
        </button>
      </div>
    </form>
  </div>
  )
}

export default CreatePost