import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Workspace } from "../models/workspace.model.js";

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

    const workspaces = await Workspace.find({owner:req.user._id})

    return res.status(200).json(new ApiResponse(200, { workspaces }, "All workspaces fetched successfully"))
})

export { createWorkspace, addEditor , getAllWorkspaces }