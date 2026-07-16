import { Request, Response } from "express";
import prisma from "@repo/db/client";

export const executeWorkFlow = async (req:Request,res:Response) => {
    res.status(200).json({
        message:"Workflow execution started!"
    })
}