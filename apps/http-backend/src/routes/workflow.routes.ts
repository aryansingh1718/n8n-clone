import { Router } from "express";
import { createWorkFlow } from "../controllers/createWorkflow.controller";
import { getWorkFlows } from "../controllers/getWorkflows.controller";
import { getWorkFlowById } from "../controllers/getWorkFlowById.controller";
import { updateWorkFlow } from "../controllers/updateWorkFlow.controller";
import { deleteWorkFlowById } from "../controllers/deleteWorkFlowById.controller";
import {executeWorkflow} from "../controllers/executeWorkFlowMannually.controller";
import { deleteAllWorkFlows } from "../controllers/deleteAllWorkFlows.controller";
import { triggerWebhook,triggerForm } from "../controllers/triggerWorkFlowById.controller";
import { showFormById } from "../controllers/showFormById.controller";

const router:Router = Router();

router.post("/",createWorkFlow);
router.get("/",getWorkFlows);
router.get("/:slug",getWorkFlowById);
router.put("/:slug",updateWorkFlow)
router.delete("/:slug",deleteWorkFlowById)
router.post("/execute/:slug",executeWorkflow);
router.post("/webhook/:slug",triggerWebhook);
router.post("/form/:slug",triggerForm);
router.delete("/",deleteAllWorkFlows);
router.get("/form/:slug",showFormById);

export default router;