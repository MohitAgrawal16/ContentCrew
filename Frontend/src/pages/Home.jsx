import React from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import TopBar from "../components/TopBar";

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
         <TopBar />

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
