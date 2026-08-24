import prisma from "@repo/db/client";
import { NodeItem, WorkFlowEdge, WorkFlowNode } from "../nodes/types";
import { executeWorkFlow } from "./executeWorkFlow";

export async function runTrackedExecution(
    workFlowId:string,
    nodes:WorkFlowNode[],
    edges:WorkFlowEdge[],
    initialData:NodeItem[] = []
) {
    const executionRecord = await prisma.execution.create({
        data:{
            workflowId:workFlowId,
            status:"pending",
            nodeResults:{}
        }
    });
    try{
        const {outputs,nodeResults} = await executeWorkFlow(nodes,edges,initialData);
        await prisma.execution.update({
            where:{
                id:executionRecord.id
            },data:{
                status:"completed",
                nodeResults:nodeResults as any,
                finishedAt:new Date()
            }
        });
        return {
            executionId:executionRecord.id,
            outputs,
            nodeResults
        }
    }catch(err){
        console.log(err);
        await prisma.execution.update({
            where:{
                id:executionRecord.id
            },
            data:{
                status:"failed",
                nodeResults:{ error: err instanceof Error ? err.message : String(err) },
                finishedAt:new Date()
            }
        })
        throw err;
    }
}