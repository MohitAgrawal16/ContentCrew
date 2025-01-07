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
   },
   {
    timestamps:true
  })

  export const Workspace = mongoose.model("Workspace",workspaceSchema)