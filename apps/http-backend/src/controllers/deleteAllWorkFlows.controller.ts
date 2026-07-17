import { Request, Response } from "express";
import prisma from "@repo/db/client";

export const deleteAllWorkFlows = async (req: Request, res: Response) => {
    try {
        await prisma.workflow.deleteMany({});
        return res.status(200).json({ message: "All workflows and executions deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};