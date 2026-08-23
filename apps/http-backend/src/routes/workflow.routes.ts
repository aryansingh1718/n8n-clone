import { Router } from "express";
import { createWorkFlow } from "../controllers/createWorkflow.controller";
import { getWorkFlows } from "../controllers/getWorkflows.controller";
import { getWorkFlowById } from "../controllers/getWorkFlowById.controller";
import { updateWorkFlow } from "../controllers/updateWorkFlow.controller";
import { deleteWorkFlowById } from "../controllers/deleteWorkFlowById.controller";
import {executeWorkflow} from "../controllers/executeWorkflow.controller";
import { deleteAllWorkFlows } from "../controllers/deleteAllWorkFlows.controller";
import { triggerWorkFlowById } from "../controllers/triggerWorkFlowById.controller";

const router:Router = Router();

router.post("/",createWorkFlow);
router.get("/",getWorkFlows);
router.get("/:slug",getWorkFlowById);
router.put("/:slug",updateWorkFlow)
router.delete("/:slug",deleteWorkFlowById)
router.post("/execute/:slug",executeWorkflow);
router.post("/webhook/:slug",triggerWorkFlowById);
router.delete("/",deleteAllWorkFlows);

export default router;