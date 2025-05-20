import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markMessagesAsRead } from "../../store/chatSlice.js";
import { format } from "date-fns";
import { Paperclip, FileText, Link, Image } from "lucide-react";

const MessageList = ({ taskId }) => {
  const dispatch = useDispatch();
 
  const user = useSelector((state) => state.auth.user);
  const messagesEndRef = useRef(null);

  const taskMessages = useSelector((state) =>  state.chat.messages[taskId]);
 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [taskMessages]);

  // useEffect(() => {
  //   if (taskMessages.some((msg) => !msg.isRead && msg.sender !== user?.id)) {
  //     dispatch(markMessagesAsRead(taskId));
  //   }
  // }, [taskMessages, taskId, dispatch, user]);

  if (typeof taskMessages =="undefined" || taskMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  const renderAttachment = (attachment) => {
    switch (attachment.type) {
      case "image":
        return (
          <div className="mt-2">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
              <img src={attachment.url} alt={attachment.name || "Image attachment"} className="max-h-40 w-auto" />
              {attachment.name && (
                <span className="text-xs mt-1 flex items-center">
                  <Image className="h-3 w-3 mr-1" />
                  {attachment.name}
                </span>
              )}
            </a>
          </div>
        );
      case "document":
        return (
          <div className="mt-2">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <div>
                <p className="text-xs font-medium truncate">{attachment.name || "Document"}</p>
                {attachment.size && <p className="text-xs text-gray-500">{Math.round(attachment.size / 1024)} KB</p>}
              </div>
            </a>
          </div>
        );
      case "link":
        return (
          <div className="mt-2">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              <Link className="h-3 w-3 mr-1" />
              {attachment.name || attachment.url}
            </a>
          </div>
        );
      default:
        return (
          <div className="mt-2">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              <Paperclip className="h-3 w-3 mr-1" />
              {attachment.name || "Attachment"}
            </a>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {taskMessages.map((message) => {
        const isCurrentUser = message.sender.toString() === user?._id.toString();
        return (
          <div key={message._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}>
              {!isCurrentUser && (
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium">{message.senderName}</p>
                  {/* <span className="text-xs bg-gray-200 text-gray-700 px-1 rounded ml-2">{message.senderRole}</span> */}
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.attachments?.length > 0 && (
                <div className="mt-1">
                  {message.attachments.map((attachment, index) => (
                    <div key={index}>{renderAttachment(attachment)}</div>
                  ))}
                </div>
              )}
              <div className="flex justify-end items-center mt-1 space-x-1">
                <p className="text-xs opacity-70">{format(new Date(message.createdAt), "HH:mm")}</p>
                {/* {isCurrentUser && <span className="text-xs">{message.isRead ? "✓✓" : "✓"}</span>} */}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
