import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, uploadPost ,getAllPosts, getAlldraftPosts ,getPostofTask} from "../controllers/post.controller.js";
import { checkOwner } from "../middlewares/postFor.middleware.js";
import { get } from "mongoose";


const postRouter = Router();

postRouter.use(verifyJWT);

postRouter.route("/").post(upload.fields([
    {name: "media", maxCount: 10},
]),checkOwner,createPost);

postRouter.route("/uploadPost").patch(uploadPost)

// route for getting all the posts which are uploaded by the user
postRouter.route("/").get(getAllPosts);
postRouter.route("/draft").get(getAlldraftPosts);

// get post corresponding to a taskId
postRouter.route("/:taskId").get(getPostofTask);

export { postRouter };