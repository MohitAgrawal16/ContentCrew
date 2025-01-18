import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, uploadPost ,getAllPosts, 
    getAlldraftPosts ,getPostofTask, getPostofHome,
    editPost ,  createAndUploadPost} from "../controllers/post.controller.js";
import { checkOwner } from "../middlewares/postFor.middleware.js";


const postRouter = Router();

postRouter.use(verifyJWT);

postRouter.route("/").post(upload.fields([
    {name: "media", maxCount: 10},
]),checkOwner,createPost);

postRouter.route("/uploadPost").post(upload.fields([
    {name: "media", maxCount: 10},
]),createAndUploadPost);

postRouter.route("/uploadPost/:postId").patch(uploadPost)

// route for getting all the posts which are uploaded by the user
postRouter.route("/").get(getAllPosts);
postRouter.route("/draft").get(getAlldraftPosts);

// route for getting all the post for home page]
postRouter.route("/homePost").get(getPostofHome);

// get post corresponding to a taskId
postRouter.route("/:taskId").get(getPostofTask);

postRouter.route("/:postId").patch(upload.fields([
    {name: "media", maxCount: 10},
]) ,editPost);

export { postRouter };