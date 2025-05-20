import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, createMessage, markAsRead } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.use(verifyJWT);

//messageRouter.route("/").post(createMessage);
messageRouter.route("/:taskId").get(getMessages);



export { messageRouter };