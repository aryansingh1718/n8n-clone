import { Request,Response } from "express";
import prisma from "@repo/db/client";
import { updateWorkFlowSchema } from "@repo/typeValidator/types";
import slugify from "slugify";

export const updateWorkFlow = async(req:Request,res:Response) => {
    const parsedData = updateWorkFlowSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(401).json({
            message:parsedData.error.issues[0]?.message
        });
    }

    const slug = req.params.slug;
    if (typeof slug !== "string") {
        return res.status(400).json({
        message: "Invalid slug",
            });
    }


    const { name , nodes , edges , description,active} = parsedData.data;
    let updatedSlug;
    if(name){
        updatedSlug = slugify(name,{
            lower:true,
            strict:true
        });
    }
    try{
        const updatedWorkFlow = await prisma.workflow.update({
            where:{
                slug:slug
            },
            data:{
                name,
                active,
                nodes,
                edges,
                description,
                slug:updatedSlug
            }
        });
        return res.status(200).json({
            message:"Workflow updated successfully",
            updatedWorkFlow
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}