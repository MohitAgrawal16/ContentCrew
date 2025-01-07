import { asyncHandler } from "../utils/asyncHandler.js";
import { Workspace } from "../models/workspace.model.js";

export const checkOwner= asyncHandler(async(req, res, next) => {
    
    const {workspaceId} = req.body;
    
    if (workspaceId){
    const workspace = await Workspace.findById(workspaceId);

      if (workspace){
        req.Owner=workspace.owner;
      }
    }
    
    next()
})
