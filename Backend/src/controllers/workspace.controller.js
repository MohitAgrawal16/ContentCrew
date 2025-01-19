import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Workspace } from "../models/workspace.model.js";
import { Task } from "../models/task.model.js";
import { Post } from "../models/post.model.js";

import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { User } from "../models/user.model.js";

const createWorkspace = asyncHandler(async (req, res, next) => {
    const { name } = req.body

    const workspace = await Workspace.create({
        name,
        owner: req.user._id
    })

    if (!workspace) {
        throw new ApiError(500, "Workspace creation failed")
    }

    return res.status(201).json(new ApiResponse(201, { workspace }, "Workspace created successfully"))
})

const addEditor = asyncHandler(async (req, res, next) => {
    
    const {username , workspaceId} = req.params
  
    const workspace = await Workspace.findById(workspaceId)

    if (!workspace) {
        throw new ApiError(404, "Workspace not found")
    }
    
    const editor = await User.findOne({username})

    if(!editor){
        throw new ApiError(404, "Editor not found")
    }

    if(workspace.owner.equals(editor._id)){
        throw new ApiError(400, "You can't add yourself as editor")
    }

    if (workspace.editors.includes(editor._id)) {
        throw new ApiError(400, "Editor already exists in this workspace")
    }
    
    workspace.editors.push(editor._id)
    
    // console.log(workspace.editors)
    await workspace.save()
   
    return res.status(200).json(new ApiResponse(200, { workspace }, "Editor added to workspace successfully"))
})

const getAllWorkspaces = asyncHandler(async (req, res, next) => {

    const workspaces = await Workspace.find({owner:req.user._id}).sort({createdAt:-1})

    return res.status(200).json(new ApiResponse(200, { workspaces }, "All workspaces fetched successfully"))
})

const getEditorWorkspaces = asyncHandler(async (req, res, next) => {

    const workspaces = await Workspace.find({editors:req.user._id}).sort({createdAt:-1})

    return res.status(200).json(new ApiResponse(200, { workspaces }, "All workspaces fetched successfully"))
})


const getWorkspace = asyncHandler(async (req, res, next) => {

    const workspace = await Workspace.findById(req.params.workspaceId)
    
    if (!workspace) {
        throw new ApiError(404, "Workspace not found")
    }

    return res.status(200).json(new ApiResponse(200, { workspace }, "Workspace fetched successfully"))
});

const getWorkspaceDetails = asyncHandler(async (req, res, next) => {
    
    //console.log(req.params.workspaceId)

    const workspace = await Workspace.aggregate([
        {
            $match: {
                _id:new ObjectId(req.params.workspaceId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "editors",
                foreignField: "_id",
                as: "editors"
            }
        },
        {
            $lookup:{
                from: "tasks",
                localField: "_id",
                foreignField: "workspace",
                as: "tasks"
            }
        },
        {
            $project: {
                "editors.password": 0,
                "editors.refreshToken": 0,
                "editors.__v": 0,
                "editors.createdAt": 0,
                "editors.updatedAt": 0,
                "editors.refreshToken": 0,
                "tasks.workspace": 0,
                "tasks.media": 0,
                "tasks.suggestions": 0,
                "tasks.createdAt": 0,
                "tasks.updatedAt": 0,
                "tasks.__v": 0,
                "tasks.description": 0
            }
        }
    ])
    
    if (!workspace) {
        throw new ApiError(404, "Workspace not found")
    }

    return res.status(200).json(new ApiResponse(200, { workspace }, "Workspace fetched successfully"))
});

const deleteWorkspace = asyncHandler(async (req, res, next) => {
    
    const workspaceId = req.params.workspaceId

    const workspace = await Workspace.findById(workspaceId)
    
    if (!workspace) {
        throw new ApiError(404, "Workspace not found")
    }

    const tasks = await Task.find({workspace:workspaceId})
    //const posts = await Post.find({taskId:{$in:tasks.map(task=>task._id)}, status:"draft"});
    console.log(tasks);
    if(tasks.length>0){
        await Task.deleteMany({workspace:workspaceId})
        await Post.deleteMany({taskId:{$in:tasks.map(task=>task._id)} , status:"draft"});
    }

    await Workspace.findByIdAndDelete(workspaceId)
    

    return res.status(200).json(new ApiResponse(200, {}, "Workspace deleted successfully"))
})

export { createWorkspace, addEditor , getAllWorkspaces
     , getEditorWorkspaces , getWorkspace , getWorkspaceDetails , deleteWorkspace };