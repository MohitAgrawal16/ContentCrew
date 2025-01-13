import React from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import TopBar from "../components/TopBar";
import NewPost from "../components/NewPost";

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

  const handleSaveDraft = (newPost) => {
    console.log("Saved as Draft:", newPost);
  };

  const handlePost = (newPost) => {
    setPosts((prev) => [
      {
        username: "You",
        avatar: "https://via.placeholder.com/40",
        content: newPost.caption,
        image: newPost.images[0] || null,
      },
      ...prev,
    ]);
  };


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
        {/* Top Bar */}
         <TopBar value="Home"/>

        {/* Content Area */}
        <div className="fixed top-24 right-10 z-50">
          <NewPost handleSaveDraft={handleSaveDraft} handlePost={handlePost} />
        </div>
        
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
