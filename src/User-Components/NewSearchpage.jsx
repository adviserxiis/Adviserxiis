import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using Axios for API calls

const NewSearchpage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  // Function to call the API when search term changes
  useEffect(() => {
    if (searchTerm) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://adviserxiis-backend-three.vercel.app/creator/getuserbyname/${searchTerm}`);
          setResults(response.data); // Assuming the API returns an array of user objects
          console.log("response",response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [searchTerm]);

  

  return (
    <div className="bg-[#121212] min-h-screen p-4 font-Poppins">
      {/* Search Input */}
      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#3A3B3C] text-white rounded-xl h-12 py-2 px-4 w-full max-w-3xl focus:outline-none "
        />
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {results.map((user, index) => (
          <div key={index} className="flex items-center space-x-4 bg-[#3A3B3C] p-4 rounded-lg cursor-pointer">
            {/* Profile Image */}
            {user.profile_photo ? (
              <img
                src={user?.profile_photo}
                alt=""
                className="w-12 h-12 rounded-full object-cover bg-red-500"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">
                  {user?.username.charAt(0)}
                </span>
              </div>
            )}

            {/* User Info */}
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-md ">{user?.username}</h3>
              <p className="text-gray-400  text-sm sm:text-md ">{user?.professional_title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewSearchpage;
