import { Request , Response } from "express"
import prisma from "@repo/db/client"

export const getWorkFlows = async (req:Request,res:Response) => {
    try{
        const workFlows = await prisma.workflow.findMany({
            select:{
                name:true,
                description:true,
                slug:true,
                nodes:true,
                edges:true
            }
        });
        return res.json({
            workFlows
        });
    }
    catch(err){
        console.log("Error in fetching the workflows", err);
        return res.status(500).json({
             message:"Something went wrong"
        });  
    }
}