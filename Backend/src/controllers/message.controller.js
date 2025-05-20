import { Message } from "../models/message.model.js";
import { Task } from "../models/task.model.js";
import mongoose from "mongoose";

const getMessages = async (req, res, next) => {

    const {taskId} = req.params
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

    const messages = await Message.find({ taskId }).sort({ createdAt: 1 });


    const unreadMessages = messages.filter(
    (msg) => !msg.readBy.some((entry) => entry.userId.toString() === userId.toString())
    );

  
    const updatePromises = unreadMessages.map((msg) =>
    Message.findByIdAndUpdate(msg._id, {
      $push: { readBy: { userId, readAt: new Date() } },
      })
    );

    await Promise.all(updatePromises);

    const updatedMessages = await Message.find({ taskId }).sort({ createdAt: 1 });
    
    return res.status(200).json({ success: true, updatedMessages });
}

const createMessage = async (req, res, next) => {
    const { content, taskId, attachments } = req.body;

    if (!content || !taskId) {
        return res.status(400).json({ error: 'Content and Task ID are required' });
    }

    const message = new Message({
        content,
        taskId,
        sender: req.user._id,
        senderName: req.user.name,
        attachments
    });

    await message.save();

    return res.status(201).json({ success: true, message });
}

const markAsRead = async (req, res, next) => {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({ error: 'Invalid message ID' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
        return res.status(404).json({ error: 'Message not found' });
    }

    message.readBy.push({ userId: req.user._id });
    await message.save();

    return res.status(200).json({ success: true, message });
}

export {getMessages, createMessage, markAsRead}