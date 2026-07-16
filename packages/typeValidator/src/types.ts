import { z } from "zod";

export const createWorkFlowSchema = z.object({
    name: z.string().min(1 , "Name is missing"),
    description: z.string().optional(),
    nodes: z.array(z.object()),
    edges: z.array(z.object()),
});

export const updateWorkFlowSchema = z.object({
    name:z.string().optional(),
    description: z.string().optional(),
    nodes: z.array(z.object()).optional(),
    edges: z.array(z.object()).optional(),
})
