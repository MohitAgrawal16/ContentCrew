import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Task from "../components/Task";
import AddnewTask from "../components/AddnewTask";

const WorkspaceDetails = ({ userRole }) => {

  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1", status: "todo" },
    { id: 2, name: "Task 2", status: "in-progress" },
  ]);
  const [editors, setEditors] = useState(["John Doe", "Jane Smith"]);
  const [newTask, setNewTask] = useState("");

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

  const addEditor = () => {
    const editorName = prompt("Enter the editor's name:");
    if (editorName && editorName.trim() !== "") {
      setEditors([...editors, editorName]);
    }
  };

  const handleAddTask = (newTask) => {
    console.log("New Task Added:", newTask);
    // Add the new task to your task list here
  };

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
          <p className="text-lg font-semibold">Project Alpha</p>
          <p className="text-md text-gray-600 mb-4">Editors:</p>
          <ul className="mb-4">
            {editors.map((editor, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span>{editor}</span>
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
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={addEditor}
            >
              Add Editor
            </button>
          )}
        </div>

        {
            userRole==="owner" 
            && (<AddnewTask handleAddTask={handleAddTask} />)
        }
     
        <div>
          <h3 className="text-lg font-semibold mb-4 mt-4">Tasks</h3>
          <div className="flex flex-col gap-4">
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
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
