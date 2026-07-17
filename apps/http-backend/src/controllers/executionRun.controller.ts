import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import { executeWorkFlow } from '../engine/executeWorkFlow';
const executionRun = async (req: Request, res: Response) => {
    const workFlowSlug = req.params.slug;
    if (typeof workFlowSlug !== "string") {
        return res.status(400).json({
        message: "Invalid slug",
            });
    }

    try{
        const workFlow = await prisma.workflow.findUnique({
            where:{
                slug:workFlowSlug
            },
            select:{
                nodes:true,
                edges:true
            }
        });
        if(!workFlow){
            return res.status(404).json({message:"Workflow not found"});
        }
        const {outputs,nodeResults}: {outputs: any; nodeResults: any} = await executeWorkFlow(workFlow.nodes as any,workFlow.edges as any);
        const execution = await prisma.execution.create({
            data:{
                workflowId:workFlowSlug,
                status:outputs.status,
                nodeResults:nodeResults
            }
        })
        return res.status(200).json(execution);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error"});
    }
}