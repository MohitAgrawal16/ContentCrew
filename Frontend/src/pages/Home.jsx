import React, { useEffect , useState } from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import TopBar from "../components/TopBar";
import NewPost from "../components/NewPost";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  // const posts = [
  //   {
  //     username: "John Doe",
  //     dp: "https://via.placeholder.com/40",
  //     caption: "This is a sample post. Excited to share my thoughts here!",
  //     image: "https://via.placeholder.com/400x200",
  //   },
  //   {
  //     username: "Jane Smith",
  //     dp: "https://via.placeholder.com/40",
  //     caption: "Loving the new design of this platform!",
  //     image: null,
  //   },
  //   {
  //     username: "Tom Cook",
  //     dp: "https://via.placeholder.com/40",
  //     caption: "What a beautiful day! 🌞",
  //     image: "https://via.placeholder.com/400x200",
  //   },
  // ];

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

  const [posts, setPosts] = useState([]);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    apiClient.get("/post/homePost").then((res) => {
      setPosts(res.data.data.posts);
      console.log(res.data.data.posts);
      console.log(res);
    }).catch((err) => {
      console.log(err);

       if(err.status === 401) {
              console.log('Unauthorized');
              dispatch(logout());
              Navigate('/loginAgain');
      } 
    });
  }, []);


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
            {posts.length!=0 && posts.map((post) => (
              <Post
                key={post._id}
                username={post.userDetails.username}
                dp={post.userDetails.dp}
                caption={post.caption}
                image={post.media[0] || null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
