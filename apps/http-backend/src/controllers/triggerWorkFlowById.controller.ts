import { Request,Response } from "express";
import prisma from "@repo/db/client";
import { executeWorkFlow } from "../engine/executeWorkFlow";
import { WorkFlowEdge,WorkFlowNode,NodeItem } from "../nodes/types";

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

        const nodes = workFlowToTrigger.nodes as unknown as WorkFlowNode[];
        const edges = workFlowToTrigger.edges as unknown as WorkFlowEdge[];
        executeWorkFlow(nodes,edges,initialData).catch(err => console.log(err));
        return res.json({
            message:"Workflow started successfully!!"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}