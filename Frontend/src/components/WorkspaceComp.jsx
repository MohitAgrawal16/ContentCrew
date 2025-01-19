import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteComp from './DeleteComp';
import { useState } from 'react';

const WorkspaceComp = ({ id, name, isOwner, onDelete }) => {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);


  const handleClick = () => {
    navigate(`/workspace/${id}`);
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Workspace Icon */}
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">folder_shared</span>
            </div>

            {/* Workspace Info */}
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-gray-500">
                {isOwner ? 'Owner' : 'Editor'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="More options"
          >
            <span className="material-icons text-gray-600">more_vert</span>
          </button> */}
            {isOwner && (
              <button
                onClick={handleDeleteClick}
                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                aria-label="Delete workspace"
              >
                <span className="material-icons text-blue-200">delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteComp
        show={showModal}
        onClose={() => setShowModal(false)} // Close the modal
        onConfirm={()=> {
          onDelete();
          setShowModal(false);
        }} // Confirm delete action
        message={`Are you sure you want to delete '${name}' workspace? 
        This will delete all your tasks and draft posts.`} // Custom message
      />

    </>
  );
};

export default WorkspaceComp;