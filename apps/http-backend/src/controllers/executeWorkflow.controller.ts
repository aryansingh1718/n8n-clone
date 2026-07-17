import {Request , Response} from "express";
import { executeWorkFlow } from "../engine/executeWorkFlow";
import { WorkFlowNode , WorkFlowEdge} from "../nodes/types"
import prisma from "@repo/db/client";

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

    const executionRecord =  await prisma.execution.create({
        data:{
            workflowId:workflowToBeExecuted.id,
            status:"pending",
            nodeResults:{}
        }
    });

    try{
        const {outputs,nodeResults} = await executeWorkFlow(
            workflowToBeExecuted.nodes as unknown as  WorkFlowNode[],
            workflowToBeExecuted.edges as unknown as WorkFlowEdge[]
        );

        await prisma.execution.update({
            where:{
                id:executionRecord.id
            },
            data:{
                status:"completed",
                nodeResults:nodeResults as any,
                finishedAt:new Date()
            }
        });
        return res.status(200).json({
            message:"Workflow executed successfully",
            outputs,
            nodeResults,
            executionId:executionRecord.id
        });
    }
    catch(err){
        console.log(err);
        await prisma.execution.update({
            where:{
                id:executionRecord.id
            },
            data:{
                status:"failed",
                nodeResults:{ error: err instanceof Error ? err.message : String(err) },
                finishedAt:new Date()
            }
        });
        return res.status(500).json({message:"Internal server error"});
    }
}