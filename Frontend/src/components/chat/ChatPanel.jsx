import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTaskId } from "../../store/chatSlice.js";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";
import { X, MessageSquare } from "lucide-react";
import { fetchMessages } from "../../store/chatSlice.js";

function ChatPanel({ taskId, taskTitle , workspaceId}) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.chat.isConnected);
  const chatRef = useRef(null);
  const unreadCount = useSelector((state) => state.chat.unreadCount[taskId] || 0);
  
  useEffect(() => {
    if (isOpen) {
      dispatch(setCurrentTaskId(taskId));
      dispatch(fetchMessages(taskId));
    } else {
      dispatch(setCurrentTaskId(null));
    }
  }, [isOpen, taskId, dispatch]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-full p-3 shadow-md hover:bg-gray-100 transition"
      >
        <MessageSquare className="h-5 w-5 text-gray-600" />

        {!isOpen && unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow">
        {unreadCount}
      </span>
       )}
      </button>

      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-16 right-4 w-80 sm:w-96 h-96 bg-white rounded-md shadow-lg flex flex-col border border-gray-200 z-50"
        >
          <div className="flex items-center justify-between p-3 border-b">
            <div>
              <h3 className="font-medium text-sm">
                {taskTitle ? `Chat: ${taskTitle}` : "Task Chat"}
              </h3>
              <p className="text-xs text-gray-500">
                {isConnected ? "Connected" : "Connecting..."}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <MessageList taskId={taskId} />
          </div>

          <div className="p-3 border-t">
            <MessageInput taskId={taskId} />
          </div>
        </div>
      )}
    </div>
  );
}


export default ChatPanel;
