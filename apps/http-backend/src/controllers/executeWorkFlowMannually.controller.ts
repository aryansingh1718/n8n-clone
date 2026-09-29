import {Request , Response} from "express";
import { WorkFlowNode , WorkFlowEdge} from "../nodes/types"
import prisma from "@repo/db/client";
import { NodeItem } from "../nodes/types";
import { runTrackedExecution } from "../engine/runTrackedExecution";

export const executeWorkflow = async (req:Request,res:Response) => {
    const workflowSlug = req.params.slug;
    if(typeof workflowSlug !== "string"){
        return res.status(400).json({message:"workflowSlug is required"});
    }

    const workflowToBeExecuted = await prisma.workflow.findUnique({
        where:{
            slug:workflowSlug
        },
        select:{
            id:true,
            nodes:true,
            edges:true
        }
    });
    if(!workflowToBeExecuted){
        return res.status(404).json({message:"Workflow not found"});
    }

    try{
        const initialData: NodeItem[] = req.body && Object.keys(req.body).length > 0 
        ? [{ json: req.body }] 
        : [];
        const {executionId,outputs,nodeResults} = await runTrackedExecution(
            workflowToBeExecuted.id,
            workflowToBeExecuted.nodes as unknown as WorkFlowNode[],
            workflowToBeExecuted.edges as unknown as WorkFlowEdge[],
            initialData
        );
        return res.json({ message: "workflow executed successfully",nodeResults, executionId, outputs });
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "workflow failed" });
    }
    
}