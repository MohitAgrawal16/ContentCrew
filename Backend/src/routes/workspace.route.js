import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createWorkspace, addEditor , getAllWorkspaces} from "../controllers/workspace.controller.js";

const workspaceRouter = Router();

workspaceRouter.use(verifyJWT);

workspaceRouter.route("/").post(createWorkspace);
workspaceRouter.route("/:workspaceId/editor").post(addEditor);

// route for getting all the workspaces
workspaceRouter.route("/").get(getAllWorkspaces);

export { workspaceRouter };