import React, { useState } from 'react';
// import logo from '../assets/'; // Use the correct path to the logo image
import Google from '../assets/Google.png'
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { useFormik } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';
import { signInWithGoogle } from '../firebase';
import { set } from 'firebase/database';
import { CircularProgress } from '@mui/material';
import new_logo from '../assets/new_logo.png'

const NewUserLogin = () => {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/, 'Email must be a valid .com or .in domain')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://adviserxiis-backend-three.vercel.app/creator/login', {
        email: formik.values.email,
        password: formik.values.password,
      });

      if (response.status === 200) {
        localStorage.setItem('userid', JSON.stringify(response.data.userid));
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          await Swal.fire({
            title: "Oops..",
            text: "Invalid email or password",
            icon: "error"
          });
        } else if (error.response.status === 404) {
          await Swal.fire({
            title: "Oops..",
            text: "User not found",
            icon: "error"
          });
        } else {
          await Swal.fire({
            title: "Oops..",
            text: "Something went wrong. Please try again",
            icon: "error"
          });
        }
      } else {
        await Swal.fire({
          title: "Oops..",
          text: "An unexpected error occurred. Please try again.",
          icon: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Trigger Google Sign-In
      setLoading(true)
      const result = await signInWithGoogle();

      // Extract user details from Google Sign-In response
      const email = result.user.email;
      const username = result.user.displayName;
      const profile_photo = result.user.photoURL;

      // Send user details to the backend
      const response = await axios.post('https://adviserxiis-backend-three.vercel.app/creator/signinwithgoogle', {
        email,
        username,
        profile_photo,
      });

      console.log("response", response);

      if (response.status === 200) {
        localStorage.setItem('userid', JSON.stringify(response.data.userid));
        navigate('/')
        // Redirect or navigate the user as needed
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      
      // Show error message
      if (error.response && error.response.status === 400) {
        await Swal.fire({
          title: "Oops..",
          text: "Email is required",
          icon: "error"
        });
      } else if (error.response && error.response.status === 500) {
        await Swal.fire({
          title: "Oops..",
          text: "Something went wrong. Please try again later.",
          icon: "error"
        });
      } else {
        await Swal.fire({
          title: "Oops..",
          text: "An unexpected error occurred",
          icon: "error"
        });
      }
    }finally{
      setLoading(false)
    }
    };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })





  return (
    <div className="flex  min-h-screen bg-[#121212] px-4 font-Poppins">
      <div className='mt-[50px] ml-[30px] hidden lg:block'>
        <img 
           src={new_logo}
           alt=""
           className='w-32'
           />
      </div>
      <div className='flex items-center justify-center w-full '>
      <div className="w-full max-w-sm p-6 bg-[#121212]">
        <h2 className="text-2xl font-bold text-center text-white">Welcome Back</h2>
        <p className="mt-2 text-sm text-center text-gray-400">
          Welcome back! Please enter your details.
        </p>

        <form className="mt-8 space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <input
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              placeholder="Email"
              className="w-full px-2 py-3 text-sm text-white placeholder-gray-400 bg-[#121212]  border-b border-b-gray-100 focus:outline-none "
            />
            {formik.touched.email &&
              formik.errors.email && (
                <p
                  style={{
                    fontSize: "13px",
                    padding: "",
                    color: "red",
                  }}
                >
                  {formik.errors.email}
                </p>
              )}
          </div>
          <div>
            <input
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder="Password"
              className="w-full px-2 py-3 text-sm text-white placeholder-gray-400 bg-[#121212]  border-b border-b-gray-100 focus:outline-none "
            />
            {formik.touched.password &&
              formik.errors.password && (
                <p
                  style={{
                    fontSize: "13px",
                    padding: "",
                    color: "red",
                  }}
                >
                  {formik.errors.password}
                </p>
              )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400">
              <input type="checkbox" className="form-checkbox text-blue-500 bg-transparent border border-[#3A3A3C] rounded focus:ring-0" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-gray-400 hover:underline">Forgot password?</a>
          </div>

          <button className="w-full py-3 text-sm font-medium text-white bg-[#407BFF] rounded-lg hover:bg-[#0056b3]" type="submit" disabled={loading}>
          { !loading ? 'Login' : <CircularProgress  color="inherit"  fontSize="small" />}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white"></div>
          <span className="mx-2 text-sm text-gray-400">Or</span>
          <div className="flex-grow border-t border-white"></div>
        </div>

        <button className="flex items-center justify-center w-full py-3 text-sm font-medium text-white bg-[#1C1C1E] rounded-lg border border-white" onClick={handleGoogleSignIn} disabled={loading}>
          <img src={Google} alt="Google Logo" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        <div className="mt-4 text-sm text-center text-gray-400">
          <p>
            Don’t have an account? <span className="text-white hover:underline cursor-pointer" onClick={() => navigate('/signup')}>Register</span>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NewUserLogin;
