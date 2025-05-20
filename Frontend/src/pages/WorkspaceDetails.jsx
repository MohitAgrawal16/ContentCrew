import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Task from "../components/Task";
import AddnewTask from "../components/AddnewTask";
import { useParams } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DeleteComp from "../components/DeleteComp";
import UserSearch from "../components/UserSearch";


const WorkspaceDetails = () => {

  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState({});
  const [userRole, setUserRole] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [editors, setEditors] = useState([]);
  const [tasks, setTasks] = useState([]);

  // const [isAddingEditor, setIsAddingEditor] = useState(false);
  // const [newEditor, setNewEditor] = useState("");


  useEffect(() => {

    apiClient.get(`/workspace/${workspaceId}`)
      .then((response) => {
        //console.log(response.data.data.workspace);
        setWorkspace(response.data.data.workspace[0]);
        setEditors(response.data.data.workspace[0].editors);
        setTasks(response.data.data.workspace[0].tasks);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }, [workspaceId]);

  useEffect(() => {

    if (workspace.owner === user._id) {
      setUserRole("owner");
    } else {
      setUserRole("editor");
    }

  }, [workspace]);

  
  const [showModal, setShowModal] = useState(false);

  const deleteEditor = (editorId) => {
    
    apiClient.delete(`/workspace/${workspaceId}/${editorId}`)
      .then((response) => {
        //console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.response.data.message);
      });
  };

  const handleAddEditor = (newEditor) => {

    if (newEditor.trim() === "") {
      toast.error("Editor's username cannot be empty");
      return;
    }

    setLoading(true);

    apiClient.post(`/workspace/${workspaceId}/${newEditor}`)
      .then((response) => {
        //console.log(response.data);
        // setEditors([...editors, newEditor]);
        // setNewEditor("");
        window.location.reload();
        setIsAddingEditor(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  const markTaskAsDone = (taskId) => {
     // not needed as of now
  };



  const deleteTask = (taskId) => {
    //setTasks(tasks.filter((task) => task.id !== taskId));

    apiClient.delete(`/task/${taskId}`)
      .then((response) => {
        //console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        //console.error("Error:", error);
        toast.error(error.response.data.message);
      });
  };

  const handleAddTask = (newTask) => {
    console.log("New Task Added:", newTask);
    setLoading(true);

    const formData = new FormData();

    formData.append("title", newTask.title);
    formData.append("description", newTask.description);
    formData.append("workspaceId", workspaceId);

    newTask.media.forEach((file) => {
      formData.append("media", file);
    });

    apiClient.post(`/task`, formData)
      .then((response) => {
        console.log(response.data);

        window.location.reload();
        //setTasks([response.data.data.task, ...tasks]);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading workspace details...</div>
      </div>
    );
  }


  return (
    <>
      <div className="flex h-screen">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-gray-800 text-white fixed h-full">
          <Sidebar />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 ml-64 overflow-y-auto p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Workspace Details</h2>
          <div className="bg-white shadow-md rounded-md p-6 mb-6">
            <p className="text-lg font-semibold">{workspace.name}</p>
            <p className="text-md text-gray-600 mb-4">Editors:</p>
            <ul className="mb-4">
              {editors != null && editors.map((editor) => (
                  <li
                    key={editor._id}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <span>{editor.username}</span>
                    {userRole === "owner" && (
                      <button
                        className="text-blue-200 hover:text-blue-300"
                        onClick={() => { setShowModal(true); }}
                        title="Delete Editor"
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    )}

                    <DeleteComp
                      show={showModal}
                      onClose={() => setShowModal(false)}
                      onConfirm={() => {
                        setShowModal(false);
                        deleteEditor(editor._id);
                      }}
                      message={`Are you sure you want to delete '${editor.username}' as an editor?`}
                    />
                  </li>
              ))}
            </ul>
            {
              (editors == null || editors.length === 0) &&
              <p className="text-gray-500 pb-2">No editors added yet</p>
            }


            {userRole === "owner" && (
              <UserSearch onSelectUser={handleAddEditor} />
            )}
          </div>

          {userRole === "owner" && <AddnewTask handleAddTask={handleAddTask} />}

          <div>
            <h3 className="text-lg font-semibold mb-4 mt-4">Tasks</h3>
            <div className="flex flex-col gap-4">
              {tasks != null && tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  workspaceId={workspaceId}
                  userRole={userRole}
                  markTaskAsDone={markTaskAsDone}
                  deleteTask={deleteTask}
                />
              ))}
            </div>
            {
              (tasks == null || tasks.length === 0) &&
              <p className="text-gray-500 bg-white p-3 rounded-md shadow-md">No tasks added yet</p>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceDetails;

