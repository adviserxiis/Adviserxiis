import React, { useState, Fragment } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog,Transition } from '@headlessui/react';
import SocialMediaLinks from './SocialMediaLinks';

const NewSaveDetails = () => {

    const categories = [
        "Actor", "Artist", "Athlete", "Author", "Blogger", "Chef", "Coach", "Comedian", "Content Creator", 
        "Dancer", "Designer", "Digital Creator", "Director", "Educator", "Entrepreneur", "Fitness Trainer", 
        "Gamer", "Graphic Designer", "Influencer", "Makeup Artist", "Model", "Musician/Band", "Photographer", 
        "Public Figure", "Speaker", "Stylist", "Tattoo Artist", "Travel Blogger", "Videographer", "Writer"
      ];
      
          const [open, setOpen] = useState(false);
          const [selectedCategories, setSelectedCategories] = useState([]);

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
            { name: 'Instagram', id: 'instagram', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
            { name: 'LinkedIn', id: 'linkedin', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
            { name: 'Facebook', id: 'facebook', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' },
            { name: 'Behance', id: 'behance', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Behance_logo.png' },
            { name: 'Dribbble', id: 'dribbble', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Dribbble_logo.png' },
            { name: 'Spotify', id: 'spotify', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' },
            { name: 'YouTube', id: 'youtube', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg' },
            { name: 'GitHub', id: 'github', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
        ];
    
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
    return (
        <div className="min-h-screen bg-[#121212] flex justify-center items-center px-4">
            <div className="w-full md:px-[100px] lg:px-[200px]">
                {/* Banner and Profile Picture */}
                <div className="relative">
                    <div className="h-24 md:h-36 lg:h-48  bg-gray-300 rounded-t-lg">
                    <img
                                src="https://via.placeholder.com/80"
                                alt="Profile"
                                className="w-full h-full border-4 border-[#121212]"
                            />
                      
                    <label htmlFor="profileBackgroundInput" className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer mr-2">
                                <EditIcon  fontSize='small'/>
                            </label>
                            <input
                                id="profileBackgroundInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                name="profile_background"
                            //   onChange={(event) => {
                            //       formik.setFieldValue("profile_background", event.target.files[0]);
                            //   }}
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

                            <label htmlFor="profileBackgroundInput" className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer ">
                                <EditIcon  fontSize='small'/>
                            </label>
                            <input
                                id="profileBackgroundInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                name="profile_background"
                            //   onChange={(event) => {
                            //       formik.setFieldValue("profile_background", event.target.files[0]);
                            //   }}
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="flex justify-end pr-4 pt-2">
                    <a href="#" className="text-xs text-blue-500">Upload banner</a>
                </div> */}

                {/* Form */}
                <div className=" py-6 rounded-lg space-y-4 mt-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full px-4 py-2 h-12 text-sm text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Professional Title"
                            className="w-full px-4 py-2 text-sm h-12 text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            maxLength="60"
                            className="w-full px-4 py-2 text-sm h-12 text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                            rows="1"
                        ></textarea>
                        {/* <div className="text-xs text-right text-gray-400">0/60</div> */}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Choose you're interested in"
                            className="w-full px-4 py-2 text-sm h-12 text-white placeholder-gray-400 bg-[#3A3A3C] rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => setOpen(true)}
                        />
                        <div className="text-xs text-right text-gray-400">max 5</div>
                        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" open={open} onClose={() => setOpen(false)}>
                    <div className="flex items-center justify-center min-h-screen">
                        <Dialog.Panel className="w-full max-w-md mx-auto bg-[#3A3B3C] p-4 rounded-lg">
                            <Dialog.Title className="text-sm font-bold text-white">Select any 5</Dialog.Title>
                            <div className="mt-4  overflow-y-auto ">
                                {categories.map(category => (
                                    <div key={category} onClick={() => handleSelectCategory(category)} className={` rounded ${selectedCategories.includes(category) ? 'bg-blue-500' : ''} cursor-pointer text-white`}>
                                        {category}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4">
                                <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium h-12 text-white bg-transparent border border-blue-500 rounded-lg hover:bg-blue-600">
                                    Back
                                </button>
                                <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium h-12 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
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
                                <Dialog.Panel className="w-full max-w-xl p-6 bg-gray-800 rounded-lg">
                                    {/* <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                                        Manage Your Social Media Links
                                    </Dialog.Title> */}
                                    <div className="space-y-2">
                                        {platforms.map((platform) => (
                                            <div key={platform.id} className="flex items-center bg-gray-500 px-4 py-2 rounded-md">
                                                <img
                                                    src={platform.icon}
                                                    alt={`${platform.name} icon`}
                                                    className="h-6 w-6 mr-4"
                                                />
                                                <div className='flex flex-col items-start w-full '>
                                                    <p>{platform.name}</p>
                                                <input
                                                    type="text"
                                                    placeholder={`Enter your ${platform.name} link`}
                                                    value={links[platform.id]}
                                                    onChange={(e) => handleLinkChange(platform.id, e.target.value)}
                                                    className="flex-1 px-4 py-2 text-sm w-full placeholder-gray-400 bg-white rounded-lg border-none focus:outline-none"
                                                />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="mr-2 bg-gray-700 text-white p-2 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="bg-blue-500 text-white p-2 rounded-lg"
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
                    <button className="w-1/2 px-4 py-2 text-sm font-medium h-12 text-white bg-transparent border border-blue-500 rounded-lg hover:bg-blue-600">
                        Back
                    </button>
                    <div className="w-2"></div>
                    <button className="w-1/2 px-4 py-2 text-sm font-medium h-12 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewSaveDetails;
