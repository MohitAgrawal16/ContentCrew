import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("dp"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/logout").post(verifyJWT, logoutUser);


export { userRouter };


