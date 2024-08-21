import React from 'react';
// import logo from '../assets/'; // Use the correct path to the logo image
import logo from '../assets/logo.png'
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

const NewUserLogin = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      {/* Logo */}
      <div className="flex flex-col justify-center items-center mb-8">
        <img src={logo} alt="Logo" className="w-24 md:w-32 mb-6 bg-white p-2 rounded-md" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2">Sign in or create Account</h1>
      <p className="text-gray-400 text-center mb-6 px-4">
        Hello! Looks like you're enjoying our page, but you haven’t signed up for an account yet.
      </p>

      {/* Phone Number Input */}
      <div className="w-full max-w-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full py-3 pl-4 pr-10 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none"
          />
          <span className="absolute right-3 top-3 text-gray-400">
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m0 8l-4-4" />
            </svg> */}
            <PermIdentityIcon />
          </span>
        </div>

        {/* Login Button */}
        <button className="w-full py-3 bg-white text-black rounded-lg mt-4 font-semibold">
          Login
        </button>
      </div>

      {/* Privacy Policy and Terms */}
      <p className="text-sm text-gray-400 mt-8 text-center">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-white underline">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="#" className="text-white underline">
          Terms of Use
        </a>.
      </p>
    </div>
  );
};

export default NewUserLogin;
