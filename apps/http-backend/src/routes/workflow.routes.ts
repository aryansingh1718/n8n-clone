import { Router } from "express";
import { createWorkFlow } from "../controllers/createWorkflow.controller";
import { getWorkFlows } from "../controllers/getWorkflows.controller";
import { getWorkFlowById } from "../controllers/getWorkFlowById.controller";
import { updateWorkFlow } from "../controllers/updateWorkFlow.controller";
import { deleteWorkFlowById } from "../controllers/deleteWorkFlowById.controller";
import { executeWorkFlow } from "../controllers/executeWorkFlow.controller";

const router:Router = Router();

router.post("/",createWorkFlow);
router.get("/",getWorkFlows);
router.get("/:slug",getWorkFlowById);
router.put("/:slug",updateWorkFlow)
router.delete("/:slug",deleteWorkFlowById)
router.post("/:slug/execute",executeWorkFlow);

export default router;