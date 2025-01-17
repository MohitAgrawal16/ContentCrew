import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logout from "./Logout";

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 h-screen bg-blue-600 text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center py-6">
          <h1 className="text-2xl font-bold">Content Crew</h1>
        </div>
        
        <nav className="px-4">
          <ul>
            <li className="mb-4">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
                  location.pathname === '/' ? 'bg-blue-700 font-medium' : ''
                }`}
              >
                <span className="material-icons mr-3">home</span>
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
                  location.pathname === '/profile' ? 'bg-blue-700 font-medium' : ''
                }`}
              >
                <span className="material-icons mr-3">person</span>
                Profile
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/workspace"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
                  location.pathname === '/workspace' ? 'bg-blue-700 font-medium' : ''
                }`}
              >
                <span className="material-icons mr-3">groups</span>
                Workspace
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/projects"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
                  location.pathname === '/projects' ? 'bg-blue-700 font-medium' : ''
                }`}
              >
                <span className="material-icons mr-3">folder</span>
                Projects
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/calendar"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
                  location.pathname === '/calendar' ? 'bg-blue-700 font-medium' : ''
                }`}
              >
                <span className="material-icons mr-3">calendar_today</span>
                Calendar
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/documents"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
                  location.pathname === '/documents' ? 'bg-blue-700 font-medium' : ''
                }`}
              >
                <span className="material-icons mr-3">description</span>
                Documents
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/reports"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
                  location.pathname === '/reports' ? 'bg-blue-700 font-medium' : ''
                }`}
              >
                <span className="material-icons mr-3">bar_chart</span>
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="px-4 py-6">
        <Logout />
        <Link
          to="/settings"
          className={`flex items-center px-3 py-2 rounded-md hover:bg-blue-500 ${
            location.pathname === '/settings' ? 'bg-blue-700 font-medium' : ''
          }`}
        >
          <span className="material-icons mr-3">settings</span>
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;