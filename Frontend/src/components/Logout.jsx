import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import apiClient from "../utils/apiClient";

const Logout = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {

    apiClient.post('/user/logout')
    .then((response) => {
      console.log(response.data);
      setShowConfirmation(false);
      dispatch(logout());
      console.log("User logged out");
      toast.success("Logged out successfully");
      navigate("/login");
    })
    .catch((error) => {
      console.error(error);
    });
   
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="flex items-center px-3 py-2 rounded-md hover:bg-blue-500 w-full"
      >
        <span className="material-icons mr-3">logout</span>
        Logout
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-black font-semibold mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-blue-200 text-white rounded-md hover:bg-blue-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;
