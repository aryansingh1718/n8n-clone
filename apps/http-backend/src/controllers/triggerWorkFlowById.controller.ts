import { Request,Response } from "express";
import prisma from "@repo/db/client";
import { WorkFlowEdge,WorkFlowNode,NodeItem } from "../nodes/types";
import { runTrackedExecution } from "../engine/runTrackedExecution";
import multer from "multer"
import { getWebhookResponse } from "../store/webhookResponseStore";

const upload = multer({
    storage: multer.memoryStorage()
});

export const triggerWebhook = async (req:Request, res:Response) => {
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
        const customResponse = getWebhookResponse(executionId);
        if(customResponse){
            return res.status(customResponse.statusCode).json(customResponse.body);
        }else {
            return res.json({ 
                message: "triggered", 
                executionId, 
                outputs 
            });
        }        
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const triggerForm = async(req:Request,res:Response) => {
    const incomingData : NodeItem[] = [{
        json:{
            formData:req.body,
            files:req.files ?? []
        }
    }];
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

        const {executionId , outputs} = await runTrackedExecution(
            workFlowToTrigger.id,
            workFlowToTrigger.nodes as unknown as WorkFlowNode[],
            workFlowToTrigger.edges as unknown as WorkFlowEdge[],
            incomingData
        )
        return res.json({ message: "triggered", executionId, outputs });
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
    
}