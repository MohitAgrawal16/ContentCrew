import { createSlice, createAsyncThunk, current} from "@reduxjs/toolkit";
import socketService from "../services/socketService.js";
import apiClient from "../utils/apiClient.js";


const initialState = {
  messages: {},
  unreadCount:{},
  currentTaskId: null,
  isConnected: false,
  error: null,
  loading: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentTaskId: (state, action) => {
      const taskId = action.payload;

      state.currentTaskId = taskId;
      state.unreadCount[taskId] = 0; // Reset unread count when task is opened
    },

    sendMessage: (state, action) => {
      const { content, taskId, attachments = [] } = action.payload;
      socketService.sendMessage({
        content,
        taskId,
        attachments,
      });
    },

    receiveMessage: (state, action) => {
      const message = action.payload;
      console.log("Received message:", message);
      if(state.messages[message.taskId] === undefined){
        state.messages[message.taskId] = [];
        state.unreadCount[message.taskId] = 0;
      }

      const exists = state.messages[message.taskId].some((m) => m._id === message._id);
      if (!exists) {
          state.messages[message.taskId].push(message);
      }
      
      if(message.taskId !== state.currentTaskId)
      state.unreadCount[message.taskId] = (state.unreadCount[message.taskId] || 0) + 1;
      else state.unreadCount[message.taskId] = 0;
    },

    markMessagesAsRead: (state, action) => {
      const taskId = action.payload;

      state.messages = state.messages.map((msg) =>
        msg.taskId === taskId ? { ...msg, isRead: true } : msg
      );

      // Notify the backend that messages are read
      socketService.markAsRead(taskId);
    },

    initSocket: (state, action) => {
      const userId = action.payload;
      socketService.connect(userId);
      state.isConnected = true;
    },

    disconnectSocket: (state) => {
      socketService.disconnect();
      state.isConnected = false;
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const taskId = action.meta.arg; 
        state.messages[taskId] = action.payload; 
        // console.log("check", state.messages[taskId]);
        state.unreadCount[taskId] = 0;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentTaskId,
  sendMessage,
  receiveMessage,
  markMessagesAsRead,
  initSocket,
  disconnectSocket,
} = chatSlice.actions;

export default chatSlice.reducer;

// Register socket listeners
export const setupSocketListeners = (dispatch) => {
  socketService.onMessage((message) => {
    dispatch(receiveMessage(message));
  });
};


export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/message/${taskId}`);
      
      if (response.status !== 200) { 
        throw new Error("Failed to fetch messages");
      }
    //  console.log(response.data.updatedMessages);
      return response.data.updatedMessages; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching messages");
    }
  }
);