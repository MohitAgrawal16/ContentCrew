import mongoose, { Schema } from 'mongoose';

const workspaceSchema = new Schema({
     
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
    editors:[{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    tasks:[{
        type: Schema.Types.ObjectId,
        ref: "Task",
    }],
   },
   {
    timestamps:true
  })

  export const Workspace = mongoose.model("Workspace",workspaceSchema)