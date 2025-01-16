import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Task} from "../models/task.model.js"
import { ObjectId } from "mongodb";

const createTask = asyncHandler(async (req, res, next) => {
    const { title, description, workspaceId } = req.body
    
    const mediaLocalPaths = req.files?.media?.map(temp => temp.path) || []
  
    let media = await Promise.all(mediaLocalPaths.map(async (path) => {
        return await uploadOnCloudinary(path)
    }))
    
    if (media.includes(null)) {
        throw new ApiError(500, "task creation failed")
    }
    media = media.map(file => file.url);

    const task = await Task.create({
        title,
        description,
        media,
        workspace: workspaceId
    })

    if (!task) {
        throw new ApiError(500, "Task creation failed")
    }

    return res.status(201).json(new ApiResponse(201, { task }, "Task created successfully"))
})

const getAllTasks = asyncHandler(async (req, res, next) => {
    
    const tasks = await Task.find({workspace:req.params.workspaceId})

    return res.status(200).json(new ApiResponse(200, { tasks }, "All tasks fetched successfully"))
})

const getTaskDetails = asyncHandler(async (req, res, next) => {
    
    const task = await Task.aggregate([
        {
            $match: {
                _id: new ObjectId(req.params.taskId)
            }
        },
        {
            $lookup: {
                from: "workspaces",
                localField: "workspace",
                foreignField: "_id",
                as: "workspace"
            }
        },
        {
            $unwind: "$workspace"
        },
        {
            $project:{
                "workspace.editors": 0,
                "workspace.__v": 0,
                "workspace.createdAt": 0,
                "workspace.updatedAt": 0
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, { task }, "Task fetched successfully"))
})

export { createTask , getAllTasks , getTaskDetails}