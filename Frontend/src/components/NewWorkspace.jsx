import React, { useState } from "react";
import { toast } from "react-toastify";
const NewWorkspace = ({ onCreate }) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");

  const handleCreate = () => {
    if (workspaceName.trim() !== "") {
      onCreate(workspaceName);
      setWorkspaceName(""); // Clear input
      setIsOpen(false); // Close modal
    } else {
       toast.error("Workspace name cannot be empty");
    }
  };

  return (
    <div>
      {/* Button to Open Modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        New Workspace
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md shadow-md w-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">close</span>
            </button>

            <h2 className="text-xl font-semibold mb-4">Create New Workspace</h2>

            <div className="mb-4">
              <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name
              </label>
              <input
                id="workspaceName"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewWorkspace;
