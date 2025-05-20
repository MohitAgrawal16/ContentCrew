import React from "react";
import { use } from "react";
import { useSelector } from "react-redux";

const ChatNotification = ({ taskId }) => {
  
  const user = useSelector((state) => state.auth.user);

  const unreadCount = useSelector((state) => state.chat.unreadCount[taskId] || 0);

  if (unreadCount === 0) return null;

  return (
    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">
      {unreadCount}
    </span>
  );
};

export default ChatNotification;
