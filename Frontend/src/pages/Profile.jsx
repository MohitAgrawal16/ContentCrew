import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import TopBar from "../components/TopBar";
import { useSelector , useDispatch } from "react-redux";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const ProfilePage = () => {

  // const [profilePicture, setProfilePicture] = useState(
  //   "https://via.placeholder.com/150"
  // );

  // const user = {
  //   username: "john_doe",
  //   firstName: "John",
  //   lastName: "Doe",
  //   posts: [
  //     {
  //       username: "john_doe",
  //       avatar: "https://via.placeholder.com/40",
  //       content: "This is my first post on the platform!",
  //       image: "https://via.placeholder.com/400x200",
  //     },
  //     {
  //       username: "john_doe",
  //       avatar: "https://via.placeholder.com/40",
  //       content: "Loving this new platform! 🚀",
  //       image: "https://via.placeholder.com/400x200",
  //     },
  //     {
  //       username: "john_doe",
  //       avatar: "https://via.placeholder.com/40",
  //       content: "Another day, another post! 🌟",
  //       image: null,
  //     },
  //   ],
  // };

  const user = useSelector((state) => state.auth.user);
  
  const [posts, setPosts] = useState([]);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    apiClient.get("/post").then((res) => {
      setPosts(res.data.data.posts);
      //console.log(res.data.data.posts);
    }).catch((err) => {

      if(err.status === 401) {
        console.log('Unauthorized');
        dispatch(logout());
        Navigate('/loginAgain');
      } 
      console.log(err);
    });
    
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
        {/* Top Bar */}
        {/* <TopBar /> */}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center">
          <div className="max-w-xl w-full">
            {/* Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex items-center">
                <img
                  src={user.dp || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover"
                />
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
                {posts.length!=0 && posts.map((post) => (
                  <Post
                       key={post._id}
                       username={user.username}
                       dp={user.dp}
                       caption={post.caption}
                       image={post.media[0] || null}
                  />
                ))}   
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;