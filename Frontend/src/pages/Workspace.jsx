import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WorkspaceComp from '../components/WorkspaceComp';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Workspace = () => {
  const [activeTab, setActiveTab] = useState('your');
  
  // Sample workspace data
  const yourWorkspaces = [
    { id: 1, name: 'Personal', isOwner: true },
    { id: 2, name: 'Team Alpha', isOwner: true },
    { id: 3, name: 'Client Work', isOwner: true },
  ];

  const editorWorkspaces = [
    { id: 4, name: 'Marketing Team', isOwner: false },
    { id: 5, name: 'Design Team', isOwner: false },
    { id: 6, name: 'Development Team', isOwner: false },
  ];

  const handleDelete = (workspaceId) => {
    console.log('Delete workspace:', workspaceId);
  };

  const handleNewWorkspace = () => {
    console.log('Create new workspace');
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Tabs and Add Workspace Button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('your')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'your'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Your Workspaces
                </button>
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'editor'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Editor Workspaces
                </button>
              </div>
              
              {activeTab === 'your' && (
                <button 
                  onClick={handleNewWorkspace}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <span className="material-icons mr-2">add</span>
                  New Workspace
                </button>
              )}
            </div>

            {/* Workspace Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === 'your' ? yourWorkspaces : editorWorkspaces).map((workspace) => (
                <WorkspaceComp
                  id={workspace.id}
                  name={workspace.name}
                  isOwner={workspace.isOwner}
                  onDelete={() => handleDelete(workspace.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {((activeTab === 'your' && yourWorkspaces.length === 0) ||
              (activeTab === 'editor' && editorWorkspaces.length === 0)) && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons text-gray-400 text-3xl">folder_off</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No workspaces found</h3>
                <p className="text-gray-500 text-center mt-2">
                  {activeTab === 'your'
                    ? 'Create a new workspace to get started'
                    : 'You havent been added to any workspaces as an editor'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;