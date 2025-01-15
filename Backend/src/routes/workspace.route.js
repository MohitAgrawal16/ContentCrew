import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createWorkspace, addEditor , getAllWorkspaces 
    , getEditorWorkspaces , getWorkspace , getWorkspaceDetails} from "../controllers/workspace.controller.js";
import { get } from "mongoose";

const workspaceRouter = Router();

workspaceRouter.use(verifyJWT);

workspaceRouter.route("/").post(createWorkspace);
workspaceRouter.route("/:workspaceId/editor").post(addEditor);

// route for getting workspaces
workspaceRouter.route("/").get(getAllWorkspaces);
workspaceRouter.route("/editor").get(getEditorWorkspaces);
//workspaceRouter.route("/:workspaceId").get(getWorkspace);
workspaceRouter.route("/:workspaceId").get(getWorkspaceDetails);

export { workspaceRouter };