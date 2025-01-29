import React from "react";
import { useState } from "react";

const Post = ({ username, dp, caption, images }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
  
    const nextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    const prevImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src={dp || "https://via.placeholder.com/150"}
          alt={`${username}'s avatar`}
          className="w-10 h-10 rounded-full mr-4"
        />
        <h3 className="text-lg font-semibold">{username}</h3>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-4">{caption}</p>
       
      {/* Image Carousel */}
      {images.length > 0 && (
        <div className="relative mb-6">
          <img
            src={images[currentIndex]}
            alt="Post"
            className="w-full h-[380px] rounded-lg object-cover"
          />
          
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
              >
                ❮
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
              >
                ❯
              </button>
            </>
          )}
        </div>
      )}

      {/* Image (if any) */}
      {/* {image && (
        <div className="mb-4">
          <img
            src={image}
            alt="Post"
            className="w-full rounded-lg object-cover"
          />
        </div>
      )} */}

      {/* Footer (Like, Comment, Share) */}
      <div className="flex items-center space-x-4 text-gray-500">
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <span className="material-icons">thumb_up</span>
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <span className="material-icons">chat_bubble_outline</span>
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <span className="material-icons">share</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Post;
