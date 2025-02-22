import React, { useState } from "react";

const NewPost = ({ handleSaveDraft, handlePost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [media, setMedia] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedia(() => [...media, ...files]);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    handleSaveDraft({ caption, images });
    setIsOpen(false);
    setCaption("");
    setImages([]);
  };

  const handlePostSubmit = () => {
    handlePost({ caption, media });
    //console.log(media);
    setIsOpen(false);
    setCaption("");
    setImages([]);
    setMedia([]);
  };

  return (
    <>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        New Post
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md shadow-md w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Create New Post</h3>

            {/* Caption Input */}
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>

            {/* Image Upload */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images:
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mb-4"
            />
            {images.length > 0 && (
              <div className="flex overflow-x-scroll space-x-2 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      key={index}
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-300 hover:bg-red-400 text-white text-xs p-0.5  rounded-full"
                    > 
                     ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={handleSave}
              >
                Save as Draft
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handlePostSubmit}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;
