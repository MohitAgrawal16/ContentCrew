import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Task } from "../models/task.model.js";

const createPost = asyncHandler(async (req, res, next) => {
    const { caption, taskId } = req.body

    const mediaLocalPaths = req.files?.media?.map(temp => temp.path)

    if (mediaLocalPaths == null) {
        throw new ApiError(400, "Please provide media files")
    }

    let media = await Promise.all(mediaLocalPaths.map(async (path) => {
        return await uploadOnCloudinary(path)
    }))

    if (media.includes(null)) {
        throw new ApiError(500, "Post creation failed")
    }

    media = media.map(file => file.url);

    let by = req.user._id;

    if (req.Owner) {
        by = req.Owner;
    }

    if (taskId) {

        const task = await Task.findById(taskId);
        //console.log(task);
        if (!task) throw new ApiError(404, "Task not found")

        task.status = "in-progress";
        await task.save();
    }

    const post = await Post.create({
        caption,
        media,
        by,
        status: "draft",
        taskId
    })

    if (!post) {
        throw new ApiError(500, "Post creation failed")
    }

    return res.status(201).json(new ApiResponse(201, { post }, "Post created successfully"))
})

const createAndUploadPost = asyncHandler(async (req, res, next) => {
    const { caption } = req.body

    const mediaLocalPaths = req.files?.media?.map(temp => temp.path)
    // console.log(mediaLocalPaths);

    if (mediaLocalPaths == null) {
        throw new ApiError(400, "Please provide media files")
    }

    let media = await Promise.all(mediaLocalPaths.map(async (path) => {
        return await uploadOnCloudinary(path)
    }))

    if (media.includes(null)) {
        throw new ApiError(500, "Post creation failed")
    }

    media = media.map(file => file.url);

    let by = req.user._id;

    const post = await Post.create({
        caption,
        media,
        by,
        status: "uploaded",
    })

    if (!post) {
        throw new ApiError(500, "Post creation failed")
    }

    return res.status(201).json(new ApiResponse(201, { post }, "Post created successfully"))
})

const uploadPost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    // console.log(postId);
    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    // if (post.by !== req.user._id) {
    //     throw new ApiError(403, "You are not authorized to upload this post")
    // }

    if (post.taskId) {

        const task = await Task.findById(post.taskId);

        if (!task) throw new ApiError(404, "Task not found")

        task.status = "done";
        await task.save();
    }

    post.status = "uploaded"
    await post.save()

    return res.status(200).json(new ApiResponse(200, { post }, "Post uploaded successfully"))
})


const getAllPosts = asyncHandler(async (req, res, next) => {

    const posts = await Post.find(
        { $and: [{ status: "uploaded" }, { by: req.user._id }] }
    ).sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, { posts }, "All posts fetched successfully"))
})

const getAlldraftPosts = asyncHandler(async (req, res, next) => {

    const posts = await Post.find(
        { $and: [{ status: "draft" }, { by: req.user._id }, { taskId: null }] }
    ).sort({ createdAt: -1 })

    return res.status(200).json(new ApiResponse(200, { posts }, "All posts fetched successfully"))
})

const getPostofTask = asyncHandler(async (req, res, next) => {
    const { taskId } = req.params

    const post = await Post.find({ taskId })

    return res.status(200).json(new ApiResponse(200, { post }, "All posts fetched successfully"))
})

const getPostofHome = asyncHandler(async (req, res, next) => {

    const posts = await Post.aggregate([
        {
            $match: {
                // $or: [
                //     { by: req.user._id },
                //     { by: { $in: req.user.following } }
                // ]
                // $ne:[
                //     {status:"draft"},
                //     {by:req.user._id}
                // ]
                by: { $ne: req.user._id },
                status: "uploaded"
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "by",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                "userDetails.password": 0,
                "userDetails.refreshToken": 0,
                "userDetails.email": 0,
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, { posts }, "All posts fetched successfully"))
})


const editPost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const { caption} = req.body
    const oldMedia = JSON.parse(req.body.oldMedia);

    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }
    const mediaLocalPaths = req.files?.media?.map(temp => temp.path)

    if(mediaLocalPaths==null && (oldMedia==null || oldMedia.length==0)){
        throw new ApiError(400, "Please provide media files")
    }
    
    let finalMedia = oldMedia || [];

    if (mediaLocalPaths) {
        let media = await Promise.all(mediaLocalPaths.map(async (path) => {
            return await uploadOnCloudinary(path)
        }))

        if (media.includes(null)) {
            throw new ApiError(500, "Post creation failed")
        }

        media = media.map(file => file.url);

        media.forEach(file => {
            finalMedia.push(file);
        });
    }
    
    post.caption = caption
    post.media = finalMedia;

    await post.save()

    return res.status(200).json(new ApiResponse(200, { post }, "Post edited successfully"))
})


export {
    createPost, uploadPost, getAllPosts,
    getAlldraftPosts, getPostofTask, getPostofHome, editPost, createAndUploadPost
};
