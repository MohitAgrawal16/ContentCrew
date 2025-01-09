import mongoose , {Schema} from "mongoose";

const taskSchema = new Schema({
    
    workspace:{
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    media:{
        type: [],
    },
    status:{
        type: String,
        enum: ["todo","in-progress","done"],
        default: "todo",
    },
    suggestions:{
        type: [],
    }
  }, 
   {
    timestamps:true
})

export const Task = mongoose.model("Task",taskSchema)