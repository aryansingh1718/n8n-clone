import { Request, Response } from 'express';
import prisma from '@repo/db/client';
import { createWorkFlowSchema } from '@repo/typeValidator/types';
import slugify from "slugify";

export const createWorkFlow = async (req: Request, res: Response) => {
    const parsedData = createWorkFlowSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({
            message:parsedData.error.issues[0]?.message
        });
    }
    
    const {name,description,nodes,edges} = parsedData.data;
    const slug = slugify(name , {
        lower:true,
        strict:true
    })
    
    try{
        const workFlow = await prisma.workflow.create({
            data:{
                name,
                slug,
                description,
                nodes,
                edges
            }
        }); 
        return res.status(201).json({
            message:"Workflow created!",
            workFlow
        })
    }
    catch(err){
        console.log("workflow creation error" , err);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}