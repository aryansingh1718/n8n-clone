import { Request,Response } from "express";
import prisma from "@repo/db/client";

const getExecutionByWorkflow = async (req:Request,res:Response) => {
    const workflowSlug = req.params.workflowSlug;
    if(typeof workflowSlug !== "string"){
        return res.status(400).json({message:"workflowSlug is required"});
    }

    try{
        const execution = await prisma.execution.findMany({
            where:{
                workflowId: workflowSlug
            }
        })

        if(!execution){
            return res.status(404).json({message:"Execution not found"});
        }
        return res.status(200).json(execution);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}