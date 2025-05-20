import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { registerUser, loginUser, refreshAccessToken, 
    logoutUser , getUsersDetails , updateDp, getSearchUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("dp"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/UsersDetails").get(verifyJWT, getUsersDetails);
userRouter.route("/updateDp").patch(verifyJWT, upload.single("dp"), updateDp);
userRouter.route("/search").get(verifyJWT, getSearchUsers);

export { userRouter };


