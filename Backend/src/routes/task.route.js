import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createTask , getAllTasks , getTaskDetails , deleteTask} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.use(verifyJWT);

// workspace id in param or in body

taskRouter.route("/").post(upload.fields([{
    name: "media",
    maxCount: 10
}]), createTask)

//taskRouter.route("/:workspaceId").get(getAllTasks);
taskRouter.route("/:taskId").get(getTaskDetails);

taskRouter.route("/:taskId").delete(deleteTask);

export { taskRouter };