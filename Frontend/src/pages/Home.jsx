import React, { useEffect , useState } from "react";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import TopBar from "../components/TopBar";
import NewPost from "../components/NewPost";
import apiClient from "../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Home = () => {

  const [posts, setPosts] = useState([]);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    apiClient.get("/post/homePost").then((res) => {
      setPosts(res.data.data.posts);
      //console.log(res.data.data.posts);
      //console.log(res);
    }).catch((err) => {
      console.log(err);

       if(err.status === 401) {
              console.log('Unauthorized');
              dispatch(logout());
              Navigate('/loginAgain');
      } 
    });
  }, []);

  const handleSaveDraft = (newPost) => {
    console.log("Saved as Draft:", newPost);
  };

  const handlePost = (newPost) => {
    
    const formData = new FormData();
    console.log(newPost);
    newPost.media.forEach((file) => {
      formData.append("media", file);
    });
    formData.append("caption", newPost.caption);

    apiClient.post("/post/uploadPost", formData)
    .then((res) => {
      console.log(res.data);
      toast.success(res.data.message);
    }).catch((err) => {
      console.log(err);
      toast.error(err.response.data.message);
    }
    );
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
        
        <div className="flex-1 overflow-y-auto p-6 flex justify-center scrollbar-hide">
          <div className="max-w-xl w-full">
            {posts.length!=0 && posts.map((post) => (
              <Post
                key={post._id}
                username={post.userDetails.username}
                dp={post.userDetails.dp}
                caption={post.caption}
                images={post.media || null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
