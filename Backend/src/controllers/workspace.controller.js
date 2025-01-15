import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Workspace } from "../models/workspace.model.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

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
    const { editorId } = req.body
    //console.log("here")
  //  console.log(req.params.workspaceId)
    const workspace = await Workspace.findById(req.params.workspaceId)

    if (!workspace) {
        throw new ApiError(404, "Workspace not found")
    }
    
    if (workspace.owner===req.user._id) {
        throw new ApiError(403, "You can't add yourself as editor")
    }

    if (workspace.editors.includes(editorId)) {
        throw new ApiError(400, "Editor already exists in this workspace")
    }
    
    workspace.editors.push(editorId)
    
    // console.log(workspace.editors)
    await workspace.save()
   
    return res.status(200).json(new ApiResponse(200, { workspace }, "Editor added to workspace successfully"))
})

const getAllWorkspaces = asyncHandler(async (req, res, next) => {

    const workspaces = await Workspace.find({owner:req.user._id}).sort({createdAt:-1})

    return res.status(200).json(new ApiResponse(200, { workspaces }, "All workspaces fetched successfully"))
})

const getEditorWorkspaces = asyncHandler(async (req, res, next) => {

    const workspaces = await Workspace.find({editors:req.user._id})

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

export { createWorkspace, addEditor , getAllWorkspaces
     , getEditorWorkspaces , getWorkspace , getWorkspaceDetails};