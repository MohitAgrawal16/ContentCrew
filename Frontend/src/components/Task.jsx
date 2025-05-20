import React from "react";
import { useNavigate } from "react-router-dom";
import DeleteComp from "./DeleteComp";
import { useState } from "react";
import { useSelector } from "react-redux";
const Task = ({ task, userRole, workspaceId, markTaskAsDone, deleteTask }) => {
  
  const navigate = useNavigate();

  const handleTaskClick = () => {
    navigate(`/workspace/${workspaceId}/task/${task._id}`);
  };

  const [showModal, setShowModal] = useState(false);

  const unreadCount = useSelector((state) => state.chat.unreadCount[task._id] || 0);

  return (
    <>
    <div
      className="relative bg-white shadow-md rounded-md p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
      onClick={handleTaskClick}
    >
      <div className="flex flex-col">
       <div className="flex items-center gap-2">
         <p className="text-lg font-semibold">{task.title}</p>
          {unreadCount > 0 && (
           <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
             {unreadCount}
           </span>
          )}
       </div>
        <p className="text-sm text-gray-500">Status: {task.status}</p>
     </div>


      {userRole === "owner" && (
        <div className="flex items-center gap-4">
          {/* <button
            className="text-green-500 hover:text-green-700"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation
              markTaskAsDone(task._id);
            }}
            title="Mark as Done"
          >
            <span className="material-icons">check_circle</span>
          </button> */}
          <button
            className="text-blue-200 hover:text-blue-300"
            onClick={(e) => {
              e.stopPropagation(); 
              setShowModal(true);
            }}
            title="Delete Task"
          >
            <span className="material-icons">delete</span>
          </button>
        </div>
      )}
    </div>

     {/* Delete Modal */}
     <DeleteComp
        show={showModal}
        onClose={() => setShowModal(false)} 
        onConfirm={()=> {
          deleteTask(task._id);
          setShowModal(false);
        }}
        message={`Are you sure you want to delete ${task.title} task?
        This will also delete all draft posts.`} 
      />
    </>
  );
};

export default Task;
