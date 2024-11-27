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
import { CircularProgress } from '@mui/material';
import new_logo from '../assets/new_logo.png'

const NewUserSignUp = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        check: false
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/, 'Email must be a valid .com or .in domain')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
        confirmPassword: Yup.string()
            .required(' Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        check: Yup.boolean()
            .oneOf([true], 'You must accept the terms and conditions')
            .required('Checkbox is required'),
    });


    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await axios.post('https://adviserxiis-backend-three.vercel.app/creator/signup', {
                email: formik.values.email,
                password: formik.values.password,
            });

            if (response.status === 200) {
                localStorage.setItem('userid', JSON.stringify(response.data.userid));
                navigate('/savedetails');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    await Swal.fire({
                        title: "Oops..",
                        text: "User Already Exist with this email",
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


            if (response.status === 200) {
                localStorage.setItem('userid', JSON.stringify(response.data.userid));
                navigate('/savedetails')
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
        } finally {
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
                    <h2 className="text-2xl font-bold text-center text-white">Register to join us</h2>
                    <p className="mt-2 text-sm text-center text-gray-400">
                        Welcome! Please enter your details.
                    </p>

                    <form className="mt-8 space-y-4" onSubmit={formik.handleSubmit}>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                placeholder="Create Password"
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

                        <div>
                            <input
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full px-2 py-3 text-sm text-white placeholder-gray-400 bg-[#121212]  border-b border-b-gray-100 focus:outline-none "
                            />
                            {formik.touched.confirmPassword &&
                                formik.errors.confirmPassword && (
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            padding: "",
                                            color: "red",
                                        }}
                                    >
                                        {formik.errors.confirmPassword}
                                    </p>
                                )}
                        </div>

                        <div className=" text-sm">
                            <label className="flex items-center text-gray-400">
                                <input type="checkbox"
                                    name='check'
                                    value={formik.values.check}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-checkbox text-blue-500 bg-transparent border border-[#3A3A3C] rounded focus:ring-0" />
                                <span className="ml-2">I agree to Terms and condition</span>
                            </label>
                            {/* <a href="#" className="text-gray-400 hover:underline">Forgot password?</a> */}
                            {formik.touched.check &&
                                formik.errors.check && (
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            padding: "",
                                            color: "red",
                                        }}
                                    >
                                        {formik.errors.check}
                                    </p>
                                )}
                        </div>

                        <button className="w-full py-3 text-sm font-medium text-white bg-[#407BFF] rounded-lg hover:bg-[#0056b3]" type="submit" disabled={loading}>
                            {!loading ? 'Register' : <CircularProgress color="inherit" fontSize="small" />}
                        </button>
                    </form>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-white"></div>
                        <span className="mx-2 text-sm text-gray-400">Or</span>
                        <div className="flex-grow border-t border-white"></div>
                    </div>

                    <button className="flex items-center justify-center w-full py-3 text-sm font-medium text-white bg-[#1C1C1E] rounded-lg border border-white" onClick={handleGoogleSignIn}>
                        <img src={Google} alt="Google Logo" className="w-5 h-5 mr-2" />
                        Continue with Google
                    </button>

                    <div className="mt-4 text-sm text-center text-gray-400">
                        <p>
                            Don’t have an account? <span className="text-white hover:underline cursor-pointer" onClick={() => navigate('/signin')}>Login</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewUserSignUp;
