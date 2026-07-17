import { Request, Response } from "express";
import prisma from "@repo/db/client";

export const getLastExecutionByWorkflow = async (req: Request, res: Response) => {
    const workflowSlug = req.params.slug;
    if (typeof workflowSlug !== "string") {
        return res.status(400).json({ message: "workflowSlug is required" });
    }

    try{
        const workflow = await prisma.workflow.findUnique({
            where: {
                slug: workflowSlug
            },
            select: {
                id: true
            }
        });
        if (!workflow) {
            return res.status(404).json({ message: "Workflow not found" });
        }

        const lastExecution = await prisma.execution.findFirst({
            where:{
                workflowId:workflow.id
            },
            orderBy:{
                startedAt:"desc"
            }
        })

        if(!lastExecution){
            return res.status(404).json({message:"No executions found for this workflow"});
        }

        return res.status(200).json({
            message:"Last execution fetched successfully",
            lastExecution
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}