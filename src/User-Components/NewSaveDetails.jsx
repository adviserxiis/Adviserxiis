import React, { useState, Fragment } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, Transition } from '@headlessui/react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';
import SocialMediaLinks from './SocialMediaLinks';
import behance from '../assets/behance.png'
import dribble from '../assets/dribble.png'
import facebook from '../assets/facebook.png'
import github from '../assets/github.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'
import spotify from '../assets/spotify.png'
import youtube from '../assets/youtube.png'
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const NewSaveDetails = () => {

    const categories = [
        "Actor", "Artist", "Athlete", "Author", "Blogger", "Chef", "Coach", "Comedian", "Content Creator",
        "Dancer", "Designer", "Digital Creator", "Director", "Educator", "Entrepreneur", "Fitness Trainer",
        "Gamer", "Graphic Designer", "Influencer", "Makeup Artist", "Model", "Musician/Band", "Photographer",
        "Public Figure", "Speaker", "Stylist", "Tattoo Artist", "Travel Blogger", "Videographer", "Writer"
    ];

    const [open, setOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()


    const [links, setLinks] = useState({
        instagram: '',
        linkedin: '',
        facebook: '',
        behance: '',
        dribbble: '',
        spotify: '',
        youtube: '',
        github: '',
    });




    const [isOpen, setIsOpen] = useState(false);

    const platforms = [
        { name: 'Instagram', id: 'instagram', icon: `${instagram}` },
        { name: 'LinkedIn', id: 'linkedin', icon: `${linkedin}` },
        { name: 'Facebook', id: 'facebook', icon: `${facebook}` },
        { name: 'Behance', id: 'behance', icon: `${behance}` },
        { name: 'Dribbble', id: 'dribbble', icon: `${dribble}` },
        { name: 'Spotify', id: 'spotify', icon: `${spotify}` },
        { name: 'YouTube', id: 'youtube', icon: `${youtube}` },
        { name: 'GitHub', id: 'github', icon: `${github}` },
    ];

    const initialValues = {
        name: '',
        professional_title: '',
        description: '',
        profile_photo: null,
        profile_background: null
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        professional_title: Yup.string().required('Professional title is required'),
        description: Yup.string().required('Description is required'),
        profile_photo: Yup.mixed()
        .nullable() // Allow null value
        .test("fileSize", "File size is too large (max 5MB)", (value) => {
          if (value === null) return true; // Skip validation if null
          return value.size <= 5 * 1024 * 1024; // 5MB in bytes
        }),
      profile_background: Yup.mixed()
        .nullable() // Allow null value
        .test("fileSize", "File size is too large (max 5MB)", (value) => {
          if (value === null) return true; // Skip validation if null
          return value.size <= 5 * 1024 * 1024; // 5MB in bytes
        })
    });

    const handleSave = () => {
        setIsOpen(false);
    };

    const handleLinkChange = (id, value) => {
        setLinks((prevLinks) => ({
            ...prevLinks,
            [id]: value,
        }));
    };

    const handleSelectCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(item => item !== category));
        } else if (selectedCategories.length < 5) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };


    const handleSubmit = async () => {
        setLoading(true)
        const userid = JSON.parse(localStorage.getItem('userid'))
        if (userid == null) {
            await Swal.fire({
                title: "Oops..",
                text: "You Need to signUp first",
                icon: "error"
            });
            navigate('/signup')
        }
        const formData = new FormData();
        const jsonData = {
            name: formik.values.name,
            professional_title: formik.values.professional_title,
            discription: formik.values.description,
        };

        if (selectedCategories.length > 0) {
            jsonData.interests = selectedCategories;
        }

        const filteredSocialLinks = Object.fromEntries(
            Object.entries(links).filter(([key, value]) => value.trim() !== "")
        );

        if (Object.keys(filteredSocialLinks).length > 0) {
            jsonData.social_links = filteredSocialLinks;
        }

        // formData.append('data', jsonData);
        formData.append('data', JSON.stringify(jsonData));
        console.log("userid", userid)
        formData.append('userid', userid);

        if (formik.values.profile_photo) {
            formData.append('profile_photo', formik.values.profile_photo);
        }

        if (formik.values.profile_background) {
            formData.append('profile_background', formik.values.profile_background);
        }
        try {
            const response = await axios.post('https://adviserxiis-backend-three.vercel.app/creator/savedetails', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            //   console.log('Response:', response.data);
            formik.resetForm();
            navigate('/')
        } catch (error) {
            console.error('Error during API call:', error.response ? error.response.data : error.message);
            await Swal.fire({
                title: "Oops..",
                text: "Something went wrong. Please try again",
                icon: "error"
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
        <div className="min-h-screen bg-[#121212] flex justify-center items-center px-4">
            <form onSubmit={formik.handleSubmit} className='w-full'>
                <div className="w-full md:px-[100px] lg:px-[200px]">
                    {/* Banner and Profile Picture */}
                    <div className="relative">
                        <div className="h-24 md:h-36 lg:h-48  bg-gray-300 rounded-t-lg">
                            <img
                                src="https://via.placeholder.com/80"
                                alt="Profile"
                                className="w-full h-full border-4 border-[#121212]"
                            />
                            <label
                                htmlFor="profileBackgroundInput"
                                className="absolute bottom-2 right-2 bg-black text-white p-1 rounded-full cursor-pointer z-10"
                            >
                                <EditIcon fontSize="small" />
                            </label>
                            <input
                                id="profileBackgroundInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                name="profile_background"
                                onChange={(event) => {
                                    formik.setFieldValue("profile_background", event.target.files[0]);
                                }}
                            />

                        </div>
                        <div className="absolute inset-x-0 -bottom-8 flex justify-center">
                            <div className="relative">
                                <img
                                    src="https://via.placeholder.com/80"
                                    alt="Profile"
                                    className="w-20 h-20 md:h-24  md:w-24   lg:h-28  lg:w-28 rounded-full border-4 border-[#121212]"
                                />
                                {/* <div className="absolute bottom-0 right-0 bg-[#1C1C1E] p-1 rounded-full">
                    <EditIcon className="text-white text-xs" />
                  </div> */}

                                <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer ">
                                    <EditIcon fontSize='small' />
                                </label>
                                <input
                                    id="profileImageInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    name="profile_photo"
                                    onChange={(event) => {
                                        formik.setFieldValue("profile_photo", event.target.files[0]);
                                    }}
                                />
                            </div>
                        </div>
                        
                    </div>
                    {/* <div className="flex justify-end pr-4 pt-2">
                    <a href="#" className="text-xs text-blue-500">Upload banner</a>
                </div> */}

                <div className='mt-[30px] '>
                                    {formik.errors.profile_background && (
                        <p
                            style={{
                                fontSize: "13px",
                                color: "red",
                            }}
                            className='text-center  '
                        >
                            {formik.errors.profile_background}
                        </p>
                    )}


                    {formik.errors.profile_photo && (
                        <p
                            style={{
                                fontSize: "13px",
                                color: "red",
                            }}
                            className='text-center'
                        >
                            {formik.errors.profile_photo}
                        </p>
                    )}
                    </div>
                     


                    {/* Form */}
                    <div className=" py-6 rounded-lg space-y-4 mt-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Name"
                                className="w-full px-4 py-2 h-12 text-sm text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formik.touched.name &&
                                formik.errors.name && (
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            padding: "",
                                            color: "red",
                                        }}
                                    >
                                        {formik.errors.name}
                                    </p>
                                )}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="professional_title"
                                value={formik.values.professional_title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Professional Title"
                                className="w-full px-4 py-2 text-sm h-12 text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                            />
                            {formik.touched.professional_title &&
                                formik.errors.professional_title && (
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            padding: "",
                                            color: "red",
                                        }}
                                    >
                                        {formik.errors.professional_title}
                                    </p>
                                )}
                        </div>
                        <div>
                            <textarea
                                placeholder="Description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                maxLength="60"
                                className="w-full px-4 py-2 text-sm h-12 text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                                rows="1"
                            ></textarea>
                            {/* <div className="text-xs text-right text-gray-400">0/60</div> */}
                            {formik.touched.description &&
                                formik.errors.description && (
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            padding: "",
                                            color: "red",
                                        }}
                                    >
                                        {formik.errors.description}
                                    </p>
                                )}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Choose you're interested in"
                                value={selectedCategories}
                                className="w-full px-4 py-2 text-sm h-12 text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => setOpen(true)}
                            />
                            <div className="text-xs text-right text-gray-400">max 5</div>
                            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" open={open} onClose={() => setOpen(false)}>
                                <div className="flex items-center justify-center min-h-screen">
                                    <Dialog.Panel className="w-full max-w-md mx-auto bg-[#3A3B3C] p-4 rounded-lg">
                                        <Dialog.Title className="text-sm font-bold text-white">Select any 5</Dialog.Title>
                                        <div className="mt-4  overflow-y-auto">
                                            {categories.map(category => (
                                                <div key={category} onClick={() => handleSelectCategory(category)} className={` rounded ${selectedCategories.includes(category) ? 'bg-blue-500' : ''} cursor-pointer text-white px-2`}>
                                                    {category}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex  mt-4 w-full">
                                            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium h-12 text-white bg-transparent border border-blue-500 rounded-lg hover:bg-blue-600 w-1/2 mr-2">
                                                Back
                                            </button>
                                            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium h-12 text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-1/2 ml-2" type="submit">
                                                Save
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </Dialog>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Add your important links"
                                onClick={() => setIsOpen(true)}
                                readOnly
                                className="w-full px-4 py-2 text-sm h-12 text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                            />
                            {/* <SocialMediaLinks
                isOpen={isDialogOpen}
                platform={selectedPlatform}
                onClose={handleCloseDialog}
            /> */}
                        </div>

                        <Transition appear show={isOpen} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-black bg-opacity-75" />
                                </Transition.Child>

                                <div className="fixed inset-0 overflow-y-auto">
                                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <Dialog.Panel className="w-full max-w-xl p-6 bg-[#17191A] rounded-lg">
                                                {/* <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                                        Manage Your Social Media Links
                                    </Dialog.Title> */}
                                                <div className="space-y-2">
                                                    {platforms.map((platform) => (
                                                        <div key={platform.id} className="flex items-center bg-[#3A3B3C] px-4 py-2 rounded-md">
                                                            <img
                                                                src={platform.icon}
                                                                alt={`${platform.name} icon`}
                                                                className="h-6 w-6 mr-4"
                                                            />
                                                            <div className='flex flex-col items-start w-full text-white'>
                                                                <p>{platform.name}</p>
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Enter your ${platform.name} link`}
                                                                    value={links[platform.id]}
                                                                    onChange={(e) => handleLinkChange(platform.id, e.target.value)}
                                                                    className="flex-1 px-4 py-2 text-black text-sm w-full placeholder-gray-400 bg-white rounded-lg border-none focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6 flex w-full">
                                                    <button
                                                        onClick={() => setIsOpen(false)}
                                                        className="mr-2 border border-[#0069B4]  text-[#0069B4] p-2 rounded-lg w-1/2"
                                                    >
                                                        Back
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        className="bg-[#0069B4] text-white p-2 rounded-lg w-1/2"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        <button className="w-1/2 px-4 py-2 text-sm font-medium h-12 text-white bg-transparent border border-blue-500 rounded-lg hover:bg-blue-600" onCLick={()=>navigate('/signup')}>
                            Back
                        </button>
                        <div className="w-2"></div>
                        <button className="w-1/2 px-4 py-2 text-sm font-medium h-12 text-white bg-blue-600 rounded-lg hover:bg-blue-700" type="submit">
                            {!loading ? 'Save' : <CircularProgress color="inherit" fontSize="small" />}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewSaveDetails;
