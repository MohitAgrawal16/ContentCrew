import React from 'react';
import  {useNavigate} from 'react-router-dom';

const WorkspaceComp = ({id,name, isOwner, onDelete }) => {

  const navigate = useNavigate();
  
  const handleClick = () =>{
    navigate(`/workspace/${id}`);
  }


  return (
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
              onClick={onDelete}
              className="p-2 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Delete workspace"
            >
              <span className="material-icons text-red-500">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceComp;