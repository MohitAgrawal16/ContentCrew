import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from './models/user.model.js';
import { Message } from './models/message.model.js';
import cookie from 'cookie';
import mongoose from 'mongoose';
import { Task } from './models/task.model.js';
import { Workspace } from './models/workspace.model.js';


function setupSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin:["http://localhost:3000", process.env.CORS_ORIGIN],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.use(async (socket, next) => {

        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || "");

            const token = cookies.accessToken;
            
            //const token = socket.handshake.headers.accesstoken;

          if (!token) {
            return next(new Error("Authentication error"))
         }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoded?._id).select("-password -refreshToken")
        console.log(user.username);
        
        if (!user) {
           return next(new Error("User not found"))
        }

         socket.user = user
         next()
       } 
       catch (error) {
          next(new Error("Authentication error"))
       }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user._id}`)
    
        // Join user to their personal room
        socket.join(socket.user._id.toString())
    
        // Handle sending messages
        socket.on("sendMessage", async (messageData) => {
          try {
            const { content, taskId, attachments } = messageData
            
            //console.log(content)
            if (!content || !taskId) {
              return
            }
    
            // Validate taskId
            if (!mongoose.Types.ObjectId.isValid(taskId)) {
              return
            }
    
            // Check if task exists and user has access
            const task = await Task.findById(taskId)
            if (!task) {
              return
            }
            //console.log("checking 1");
            // Create and save message
            const message = new Message({
              content,
              taskId,
              sender: socket.user._id,
              senderName: socket.user.username,
              readBy: [{ userId: socket.user._id,
                         readAt: new Date(),
               } ], // Mark as read by sender
              attachments: attachments || []
            })
    
            await message.save()
            //console.log(message);
            // Get users associated with this task
            const workspace = await Workspace.findById(task.workspace)
            
            const involvedUserIds = [
                  workspace.owner.toString(),
                  ...(workspace.editors || []).map((id) => id.toString()),
            ]
          
           // Broadcast message to all involved users
            const messageToSend = {
              _id: message._id.toString(),
              content: message.content,
              sender: message.sender.toString(),
              senderName: message.senderName,
              taskId: message.taskId.toString(),
              attachments: message.attachments,
              createdAt: message.createdAt.toISOString(),
              workspaceId: task.workspace.toString()
            }
    
            involvedUserIds.forEach((userId) => {
              // Add isRead property based on the recipient
             // const isRead = userId === socket.user._id.toString()
              io.to(userId).emit("receiveMessage", {
                ...messageToSend
              })
            })
    
            // Emit task update to notify about new messages
            // involvedUserIds.forEach((userId) => {
            //   io.to(userId).emit("taskUpdate", {
            //     taskId: task._id.toString(),
            //     hasNewMessages: userId !== socket.user._id.toString(),
            //   })
            // })
          } catch (error) {
            console.error("Error handling message:", error)
          }
        })
    
        // Handle marking messages as read
        socket.on("markAsRead", async ({ taskId }) => {
          try {
            if (!mongoose.Types.ObjectId.isValid(taskId)) {
              return
            }
    
            // Mark all messages in the task as read by this user
            await Message.updateMany(
              {
                taskId,
                sender: { $ne: socket.user._id },
                "readBy.userId": { $ne: socket.user._id },
              },
              {
                $push: {
                  readBy: {
                    userId: socket.user._id,
                    readAt: new Date(),
                  },
                },
              },
            )
    
            // Notify the user that messages have been read
            socket.emit("messagesRead", { taskId })
    
            // Get task to find involved users
            const task = await Task.findById(taskId)
            const workspace = await Workspace.findById(task.workspace)
            if (task) {
              // Emit task update to notify about read messages
                const involvedUserIds = [
                    workspace.owner.toString(),
                    ...(workspace.editors || []).map((id) => id.toString()),
                ]
    
              involvedUserIds.forEach((userId) => {
                io.to(userId).emit("taskUpdate", {
                  taskId: task._id.toString(),
                  hasNewMessages: false,
                })
              })
            }
          } catch (error) {
            console.error("Error marking messages as read:", error)
          }
        })
    
        // Join task-specific rooms
        socket.on("joinTask", async ({ taskId }) => {
          try {
            if (!mongoose.Types.ObjectId.isValid(taskId)) {
              return
            }
    
            // Check if user has access to the task
            const task = await Task.findById(taskId)
            if (!task) {
              return
            }
            const workspace = await Workspace.findById(task.workspace)
            if (!workspace) {
              return
            }
            const hasAccess = [
              workspace.owner.toString(),
              ...(workspace.editors || []).map((id) => id.toString()),
            ].includes(socket.user._id.toString())

            if (hasAccess) {
              socket.join(`task:${taskId}`)
              console.log(`User ${socket.user._id} joined task room: ${taskId}`)
            }
          } catch (error) {
            console.error("Error joining task room:", error)
          }
        })
    
        // Leave task-specific rooms
        socket.on("leaveTask", ({ taskId }) => {
          socket.leave(`task:${taskId}`)
          console.log(`User ${socket.user._id} left task room: ${taskId}`)
        })
    
        socket.on("disconnect", () => {
          console.log(`User disconnected: ${socket.user._id}`)
        })
      })

    return io;
}


export {setupSocketServer};