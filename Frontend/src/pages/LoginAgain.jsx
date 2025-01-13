import React from "react";
import { useNavigate } from "react-router-dom";

const LoginAgain = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to your login route
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-md rounded-md p-8 text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Session Expired</h1>
        <p className="text-gray-600 mb-6">
          Your session has expired. Please log in again to continue.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Click Here to Login
        </button>
      </div>
    </div>
  );
};

export default LoginAgain;
