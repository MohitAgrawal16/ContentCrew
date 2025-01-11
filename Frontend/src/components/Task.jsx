import React from "react";
import { useNavigate } from "react-router-dom";

const Task = ({ task, userRole, markTaskAsDone, deleteTask }) => {
  const navigate = useNavigate();

  const handleTaskClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-md p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
      onClick={handleTaskClick}
    >
      <div>
        <p className="text-lg font-semibold">{task.name}</p>
        <p className="text-sm text-gray-500">Status: {task.status}</p>
      </div>
      {userRole === "owner" && (
        <div className="flex items-center gap-4">
          <button
            className="text-green-500 hover:text-green-700"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation
              markTaskAsDone(task.id);
            }}
            title="Mark as Done"
          >
            <span className="material-icons">check_circle</span>
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation
              deleteTask(task.id);
            }}
            title="Delete Task"
          >
            <span className="material-icons">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Task;
