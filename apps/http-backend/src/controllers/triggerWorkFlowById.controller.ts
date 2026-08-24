import { Request,Response } from "express";
import prisma from "@repo/db/client";
import { WorkFlowEdge,WorkFlowNode,NodeItem } from "../nodes/types";
import { runTrackedExecution } from "../engine/runTrackedExecution";

export const triggerWorkFlowById = async (req:Request, res:Response) => {
    const initialData: NodeItem[] = [{ json: req.body }];
    const slug = req.params.slug;
    if (typeof slug !== "string") {
        return res.status(400).json({
        message: "Invalid slug",
            });
    }

    try{
        const workFlowToTrigger = await prisma.workflow.findFirst({
            where:{
                slug
            }
        })
        if(!workFlowToTrigger){
            return res.status(404).json({
                message:"This Workflow doesn't exist."
            })
        }
        if(!workFlowToTrigger.active){
            return res.status(404).json({
                message:"this workflow cannot be executed yet!"
            });
        }
        const {executionId,outputs} = await runTrackedExecution(
                    workFlowToTrigger.id,
                    workFlowToTrigger.nodes as unknown as WorkFlowNode[],
                    workFlowToTrigger.edges as unknown as WorkFlowEdge[],
                    initialData
                );
                return res.json({ message: "triggered", executionId, outputs });
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}