import React, { useState } from "react";

const NewVerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Handle change in input fields
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Entered OTP is: " + otp.join(""));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-white text-2xl font-semibold mb-6">
          Enter OTP
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Enter the code we've sent to your phone number +1 123 456 789
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((data, index) => (
              <input
                className="w-12 h-12 text-center text-xl bg-[#323232] rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>


          <p className="text-center text-blue-500 mb-4 cursor-pointer">
            Resend Code
          </p>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-white text-black py-3 px-3 rounded-lg w-full font-bold"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVerifyOTP;
