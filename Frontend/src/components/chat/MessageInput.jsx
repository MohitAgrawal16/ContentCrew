import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../store/chatSlice.js";
import { SendHorizontal, Paperclip, X } from "lucide-react";

const MessageInput = ({ taskId }) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.chat.isConnected);

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((!message.trim() && attachments.length === 0) || !isConnected || isUploading) {
      return;
    }

    const finalAttachments = attachments.map((attachment) => ({
      ...attachment,
      file: undefined,
    }));

    dispatch(sendMessage({ content: message, taskId, attachments: finalAttachments }));

    setMessage("");
    setAttachments([]);
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const newAttachments = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const localUrl = URL.createObjectURL(file);

      let type = file.type.startsWith("image/") ? "image" : "document";

      newAttachments.push({
        type,
        url: localUrl,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        file,
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => {
      const newAttachments = [...prev];

      if (newAttachments[index].file) {
        URL.revokeObjectURL(newAttachments[index].url);
      }

      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  return (
    <div>
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative bg-gray-100 rounded-md p-1 flex items-center">
              {attachment.type === "image" && (
                <img
                  src={attachment.url || "/placeholder.svg?height=40&width=40"}
                  alt={attachment.name || "Image preview"}
                  className="h-8 w-8 object-cover rounded mr-1"
                />
              )}
              <span className="text-xs truncate max-w-[100px]">{attachment.name || "Attachment"}</span>
              <button type="button" onClick={() => removeAttachment(index)} className="ml-1 text-gray-500 hover:text-gray-700">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-md transition"
          disabled={!isConnected || isUploading}
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected || isUploading}
        />

        <button
          type="submit"
          disabled={(!message.trim() && attachments.length === 0) || !isConnected || isUploading}
          className="h-9 w-9 flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
