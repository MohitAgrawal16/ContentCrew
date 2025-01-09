import React from "react";

const Post = ({ username, avatar, content, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <img
          src={avatar}
          alt={`${username}'s avatar`}
          className="w-10 h-10 rounded-full mr-4"
        />
        <h3 className="text-lg font-semibold">{username}</h3>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-4">{content}</p>

      {/* Image (if any) */}
      {image && (
        <div className="mb-4">
          <img
            src={image}
            alt="Post"
            className="w-full rounded-lg object-cover"
          />
        </div>
      )}

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
