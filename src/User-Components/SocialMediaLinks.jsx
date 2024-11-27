import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const SocialMediaLinks = ({ isOpen, platform, onClose }) => {
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
    const [currentLink, setCurrentLink] = useState('');

    const handleSave = () => {
        setLinks({ ...links, [platform]: currentLink });
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                            <Dialog.Panel className="w-full max-w-lg p-6 bg-gray-800 rounded-lg">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                                    Edit {platform.charAt(0).toUpperCase() + platform.slice(1)} Link
                                </Dialog.Title>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={currentLink}
                                        onChange={(e) => setCurrentLink(e.target.value)}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2 focus:outline-none"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button onClick={onClose} className="mr-2 bg-gray-700 text-white p-2 rounded-lg">
                                        Cancel
                                    </button>
                                    <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded-lg">
                                        Save
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default SocialMediaLinks;
