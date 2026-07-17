import { z } from "zod";

const nodeSchema = z.object({
    id: z.string(),
    type: z.string(),
    params: z.record(z.string(), z.any()).optional().default({}),
});

const edgeSchema = z.object({
    source: z.string(),
    target: z.string(),
});

export const createWorkFlowSchema = z.object({
    name: z.string().min(1 , "Name is missing"),
    description: z.string().optional(),
    nodes: z.array(nodeSchema),
    edges: z.array(edgeSchema),
});

export const updateWorkFlowSchema = z.object({
    name:z.string().optional(),
    description: z.string().optional(),
    nodes: z.array(nodeSchema).optional(),
    edges: z.array(edgeSchema).optional(),
})
