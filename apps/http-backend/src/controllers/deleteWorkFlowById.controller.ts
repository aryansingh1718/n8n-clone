import { Request,Response } from "express";
import prisma from "@repo/db/client";

export const deleteWorkFlowById = async (req:Request,res:Response) => {
    const slug = req.params.slug;
    if(typeof(slug) != "string"){
        return res.status(400).json({
            message:"Invalid slug"
        })
    }
    
    try{
        const workFlow = await prisma.workflow.findUnique({
            where:{
                slug
            }
        });
        if(!workFlow){
            return res.status(404).json({
                message:"This Workflow cannot be deleted as it doesn't exist."
            })
        }

        await prisma.workflow.delete({
            where:{
                slug
            }
        });
        return res.status(200).json({
            message:"Workflow deleted successfully."
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong!"
        })
    }
}