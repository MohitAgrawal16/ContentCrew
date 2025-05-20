import mongoose,{Schema} from "mongoose";

const messageSchema = new Schema({
    
    content: {
        type: String,
        required: true,
        trim: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    senderName:{
        type: String,
        required: true,
    },
    readBy: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          readAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      attachments: [
        {
          type: {
            type: String,
            enum: ["image", "document", "link"],
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
          name: String,
          size: Number,
          mimeType: String,
        },
      ],
},{
    timestamps: true,
})

export const Message = mongoose.model("Message",messageSchema)

