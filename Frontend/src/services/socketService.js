import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (!this.socket) {
      this.socket = io( "http://localhost:8000", {
        query: { userId }, 
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000, 
      });

      this.socket.on("connect", () => {
        console.log("Socket connected");
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      this.socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage({ content, taskId, attachments }) {
    if (this.socket) {
      this.socket.emit("sendMessage", { content, taskId, attachments });
    }
  }

  joinTask(taskId) {
    if (this.socket) {
      this.socket.emit("joinTask", taskId);
    }
  }

  leaveTask(taskId) {
    if (this.socket) {
      this.socket.emit("leaveTask", taskId);
    }
  }

  markAsRead(taskId) {
    if (this.socket) {
      this.socket.emit("markAsRead", taskId);
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on("receiveMessage", (message) => {
        //console.log("Message received:", message);
        callback(message);
      });
    }
  }
}

const socketService = new SocketService();
export default socketService;

