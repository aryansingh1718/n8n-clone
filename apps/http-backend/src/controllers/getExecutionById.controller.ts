import { Request,Response } from "express";
import prisma from "@repo/db/client";

export const getExecutionById = async (req:Request,res:Response) => {
    const executionId = req.params.id;
    if(typeof executionId !== "string"){
        return res.status(400).json({message:"Invalid execution id"});
    }

    try{
        const execution = await prisma.execution.findUnique({
            where:{
                id:executionId
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
