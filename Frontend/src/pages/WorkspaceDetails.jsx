import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Task from "../components/Task";
import AddnewTask from "../components/AddnewTask";
import { useParams } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { useSelector } from "react-redux";

const WorkspaceDetails = () => {
  
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState({});
  const [userRole, setUserRole] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [loading , setLoading] = useState(true);
  const [editors, setEditors] = useState([]);
  const [tasks, setTasks] = useState([]);
  
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

    if(workspace.owner === user._id) {
      setUserRole("owner");
    }else {
      setUserRole("editor");
    }

  }, [workspace]);


  // useEffect(() => {
  
  //   apiClient.get(`/workspace/${workspaceId}`)
  //   .then((response) => {
  //     //console.log(response.data.data.workspace);
  //     setWorkspace(response.data.data.workspace);
  //    // console.log(workspace)
  //   //  console.log(workspace.editors)
  //     //setLoading(false);

     
      
  //     // return apiClient.get('/user/UsersDetails' ,{
  //     //   userIds:workspace.editors
  //     // })
  //   })
  //   // .then((response) => {
  //   //   console.log(response.data);
  //   //   //setEditors(response.data.data.users.map((user) => user.name));
  //   //   setLoading(false);
  //   // })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });

  // }, []);

  // useEffect(() => {
    
  //   if(workspace.owner === user._id) {
  //     setUserRole("owner");
  //   }else {
  //     setUserRole("editor");
  //   }

  //   apiClient.get('/user/UsersDetails/' ,{
  //         params:{
  //           userIds:workspace.editors
  //         }
  //     })
  //     .then((response) => {
  //       setEditors(response.data.data.users.map((user) => user.username));
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // }, [workspace]);
 
  const [newTask, setNewTask] = useState("");
  const [isAddingEditor, setIsAddingEditor] = useState(false);
  const [newEditor, setNewEditor] = useState("");
  

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), name: newTask, status: "todo" }]);
    setNewTask("");
  };

  const markTaskAsDone = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: "done" } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const deleteEditor = (editor) => {
    setEditors(editors.filter((e) => e !== editor));
  };

  const handleAddEditor = () => {
    if (newEditor.trim() !== "") {
      setEditors([...editors, newEditor]);
      setNewEditor("");
      setIsAddingEditor(false);
    }
  };

  const handleAddTask = (newTask) => {
    console.log("New Task Added:", newTask);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading workspace details...</div>
      </div>
    );
  }


  return (
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
            {editors!=null && editors.map((editor) => (
              <li
                key={editor._id}
                className="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span>{editor.username}</span>
                {userRole === "owner" && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteEditor(editor)}
                    title="Delete Editor"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
          {userRole === "owner" && (
            <div>
              {!isAddingEditor ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={() => setIsAddingEditor(true)}
                >
                  Add Editor
                </button>
              ) : (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Enter editor's name"
                    value={newEditor}
                    onChange={(e) => setNewEditor(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddEditor}
                    className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingEditor(false)}
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {userRole === "owner" && <AddnewTask handleAddTask={handleAddTask} />}

        <div>
          <h3 className="text-lg font-semibold mb-4 mt-4">Tasks</h3>
          <div className="flex flex-col gap-4">
            {tasks!=null && tasks.map((task) => (
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
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDetails;

