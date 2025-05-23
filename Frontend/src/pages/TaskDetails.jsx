import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {toast}  from 'react-toastify'
import ChatPanel from "../components/chat/ChatPanel.jsx";
import ChatNotification from "../components/chat/ChatNotification.jsx";

const TaskDetails = () => {

  const { workspaceId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const user = useSelector((state) => state.auth.user);
  
  const [post, setPost] = useState(null); 
  const [caption, setCaption] = useState(""); 
  const [media, setMedia] = useState([]); 
  const [mediaPrieview, setMediaPreview] = useState([]); 
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {

    apiClient.get(`/task/${taskId}`)
      .then((response) => {
        setTask(response.data.data.task[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      apiClient.get(`/post/${taskId}`)
      .then((response) => {
        setPost(response.data.data.post[0]);
      }
      )
      .catch((error) => {
        console.error("Error:", error);
      }
      );

  }, []);

  useEffect(() => {

    if (task) {
      if (task.workspace.owner === user._id) {
        setUserRole("owner");
      } else {
        setUserRole("editor");
      }
      // console.log(task);
      // console.log(task.media.length);
      setLoading(false);
    }

  }, [task]);

  const handleCreatePost = () => {
    if (caption.trim() === ""  && media.length === 0) {
      toast.error("Please add a caption or upload an image.");
      return;
    }
    const formData = new FormData();

    media.forEach((file) => {
      formData.append("media", file);
    });
    formData.append("caption", caption);
    formData.append("taskId", taskId);
    formData.append("workspaceId", workspaceId);
    console.log(formData);

    apiClient.post('/post',formData)
      .then((response) => {
        console.log(response.data);
        setPost(response.data.data.post);
        setCaption("");
        setMedia([]);
        setMediaPreview([]);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.response.data.message);
      });
  };

  const handlePublishPost = () => {
    //setPost((prev) => ({ ...prev, status: "uploaded" }));
    apiClient.patch(`/post/uploadPost/${post._id}`,)
      .then((response) => {
        //setPost((prev) => ({ ...prev, status: "uploaded" }));
        console.log(response.data);
        setPost(response.data.data.post);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleEditPost = () => {
    setIsEditing(false);

    const newMedia = media.filter((file) => typeof file !== "string");
    const oldMedia = media.filter((file) => typeof file === "string");
    
    const formData = new FormData();
    newMedia.forEach((file) => {
      formData.append("media", file);
    });
    formData.append("caption", caption);
    formData.append("oldMedia", JSON.stringify(oldMedia));

    apiClient.patch(`/post/${post._id}`,formData)
      .then((response) => {
        console.log(response.data);
        setPost(response.data.data.post);
        setCaption("");
        setMedia([]);
        setMediaPreview([]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setMedia((prevImages) => [...prevImages, ...files]);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setMediaPreview((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setMedia(media.filter((_, i) => i !== index));
    setMediaPreview(mediaPrieview.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading task details...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* <ChatNotification taskId={taskId} /> */}
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
          {/* Task Details */}
          <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{task.description}</p>

          {task != null && task.media.length != 0 && (post==null || post.status=="draft") && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Media Files:</h2>
              <div className="grid grid-cols-3 gap-4">

                {task != null && task?.media?.length != 0 && task.media.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file}
                      alt={`Media ${index + 1}`}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <a
                      href={file}
                      download={`Media-${index + 1}`}
                      className="absolute bottom-2 right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>)}
           
          {/* Post Section */}
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Post Section</h2>

            {post!=null ? (
              <div>
                {/* Post Display */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Caption:</h3>
                  {isEditing ? (
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-700 bg-white p-3 rounded-md">
                      {post.caption}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Images:</h3>
                  {isEditing ? (
                    <>
                      <div className="flex overflow-x-scroll gap-4 mb-4">
                        {mediaPrieview.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={img}
                              alt={`Upload preview ${idx + 1}`}
                              className="w-64 h-64 object-cover rounded-md"
                            />
                            <button
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Upload New Images:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="mt-1"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex overflow-x-scroll gap-4">
                      {post.media.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Post image ${idx + 1}`}
                          className="w-64 h-64 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Role-Specific Actions */}
                {post?.status=="draft" && userRole === "editor" && !isEditing && (
                  <button
                    onClick={() => {
                      setCaption(post.caption);
                      setMedia(post.media);
                      setMediaPreview(post.media);
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit Post
                  </button>
                )}
                {userRole === "editor" && isEditing && (
                  <button
                    onClick={handleEditPost}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                )}
                {userRole === "owner" && post.status === "draft" && (
                  <button
                    onClick={handlePublishPost}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Post
                  </button>
                )}
                {post.status === "uploaded" && (
                  <p className="text-green-600 font-semibold mt-4">
                    Post has been uploaded.
                  </p>
                )}
              </div>
            ) : userRole === "editor" ? (
              <div>
                {/* Create Post */}
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  rows="3"
                  placeholder="Write your caption here..."
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Images:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mt-1"
                  />
                </div>
                {mediaPrieview.length > 0 && (
                  <div className="flex overflow-x-scroll gap-4 mb-4">
                    {mediaPrieview.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`Upload preview ${idx + 1}`}
                          className="w-64 h-64 object-cover rounded-md"
                        />
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Post
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No post available yet.</p>
            )}
          </div>

        </div>
      </div>

      <ChatPanel taskId={taskId} taskTitle={task.title} workspaceId={workspaceId} />
    </div>
  );
};

export default TaskDetails;
