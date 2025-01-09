import React from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const Home = () => {
  const posts = [
    {
      username: "John Doe",
      avatar: "https://via.placeholder.com/40",
      content: "This is a sample post. Excited to share my thoughts here!",
      image: "https://via.placeholder.com/400x200",
    },
    {
      username: "Jane Smith",
      avatar: "https://via.placeholder.com/40",
      content: "Loving the new design of this platform!",
      image: null,
    },
    {
      username: "Tom Cook",
      avatar: "https://via.placeholder.com/40",
      content: "What a beautiful day! 🌞",
      image: "https://via.placeholder.com/400x200",
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
          <h1 className="text-lg font-semibold">Home</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <div className="relative">
              <span className="material-icons cursor-pointer">notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm font-medium">Tom Cook</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center">
          <div className="max-w-xl w-full">
            {posts.map((post, index) => (
              <Post
                key={index}
                username={post.username}
                avatar={post.avatar}
                content={post.content}
                image={post.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
