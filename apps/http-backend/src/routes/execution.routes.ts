import { Router } from "express";
import { getExecutionByWorkflow  } from "../controllers/getExecutionByWorkflow.controller";
import { getExecutionById } from "../controllers/getExecutionById.controller";
import { getLastExecutionByWorkflow } from "../controllers/getLastExecutionByWorkFlow.controller";

const router: Router = Router();

router.get("/workflow/:slug",getExecutionByWorkflow);
router.get("/:id",getExecutionById);
router.get("/workflow/latest/:slug",getLastExecutionByWorkflow);

export default router;