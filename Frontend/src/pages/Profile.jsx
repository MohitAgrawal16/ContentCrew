import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import TopBar from "../components/TopBar";
import { useSelector, useDispatch } from "react-redux";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { login } from "../store/authSlice"
import { toast } from "react-toastify";

const ProfilePage = () => {

  const user = useSelector((state) => state.auth.user);

  const [posts, setPosts] = useState([]);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditDpOpen, setIsEditDpOpen] = useState(false);
  const [newDp, setNewDp] = useState(null); 
  const [fileDp, setFileDp] = useState([]);

  useEffect(() => {
    apiClient.get("/post").then((res) => {
      setPosts(res.data.data.posts);
      //console.log(res.data.data.posts);
    }).catch((err) => {

      if (err.status === 401) {
        console.log('Unauthorized');
        dispatch(logout());
        Navigate('/loginAgain');
      }
      console.log(err);
    });

  }, []);

  const handleEditDp = (e) => {
    setIsEditDpOpen(true);
  };

  const handleDpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // const reader = new FileReader();
      // reader.onload = () => setNewDp(reader.result);
      // reader.readAsDataURL(file);
      setNewDp(URL.createObjectURL(file));
      setFileDp(file);
    }
  };

  const saveNewDp = () => {
    
    const formData = new FormData();
    formData.append("dp", fileDp);

    apiClient.patch("/user/updateDp", formData).then((res) => {
      //console.log("DP Updated:", res.data.data.user.dp);
      dispatch(login(res.data.data.user))
      toast.success("Profile Picture Updated Successfully");
    }
    ).catch((err) => {
      console.log(err);
    });

    //console.log("New DP Saved:", newDp);
    setIsEditDpOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
        {/* Top Bar */}
        {/* <TopBar /> */}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center scrollbar-hide">
          <div className="max-w-xl w-full">
            {/* Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex items-center relative">
                <div className="relative">
                  <img
                    src={user.dp || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover"
                  />
                  <button
                    onClick={handleEditDp}
                    className="absolute z-10 bottom-1 left-24 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                  >
                    <span className="material-icons text-sm">edit</span>
                  </button>
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <p className="text-gray-600">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

            </div>

            {/* Posts Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
              <div className="space-y-4">
                {posts.length != 0 && posts.map((post) => (
                  <Post
                    key={post._id}
                    username={user.username}
                    dp={user.dp}
                    caption={post.caption}
                    images={post.media|| null}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit DP Modal */}
      {isEditDpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Profile Picture</h2>
            <div className="flex flex-col items-center">
              {/* Current or New DP */}
              <img
                src={newDp || user.dp || "https://via.placeholder.com/150"}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover mb-4"
              />

              {/* Upload Button */}
              <input
                type="file"
                accept="image/*"
                onChange={handleDpChange}
                className="text-sm mb-4"
              />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditDpOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewDp}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePage;