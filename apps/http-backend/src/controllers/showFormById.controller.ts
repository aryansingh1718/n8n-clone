import { Request,Response } from "express";
import prisma from "@repo/db/client";
import { WorkFlowNode } from "../nodes/types";

export const showFormById = async (req:Request,res:Response) => {
    const slug = req.params.slug;
    if(typeof slug !== "string"){
        return res.status(400).json({
        message: "Invalid slug",
            });
    }
    const workFlow = await prisma.workflow.findFirst({
        where:{
            slug
        }
    })
    if(!workFlow){
        return res.status(404).json({
            message:"This Workflow doesn't exist."
        })
    }
    if(workFlow.nodes == null){
        return res.status(400).json({
            message:"This workflow has no node"
        })
    }
    try{
        const nodes = workFlow.nodes as unknown as WorkFlowNode[];
        const formNode = nodes.find(node => node.type === "form");
        if (!formNode) {
            return res.status(400).send("This workflow doesn't have a form trigger");
        }

        const fields = formNode.params.fields || [
        { name: "name", label: "Full Name", type: "text" },
        { name: "email", label: "Email Address", type: "email" }
        ];

        const renderedInputs = fields.map((field:any) => `
        <div class = "field-group>
            <label for="${field.name}">${field.label}</label>
            <input 
                id="${field.name}" 
                type="${field.type || "text"}" 
                name="${field.name}" 
                required 
                placeholder="Enter ${field.label || field.name}..."
            />
        </div>`).join("");

        const pageTitle = workFlow.name || "Form Submission";
        const htmlPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${pageTitle}</title>
            <style>
            * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body { background-color: #f8fafc; color: #1e293b; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 16px; }
            .card { background: #ffffff; width: 100%; max-width: 440px; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
            h2 { margin-top: 0; margin-bottom: 24px; font-size: 22px; text-align: center; color: #0f172a; }
            .field-group { margin-bottom: 20px; }
            label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: #334155; }
            input { width: 100%; padding: 10px 14px; font-size: 15px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.2s; }
            input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
            button { width: 100%; padding: 12px; background-color: #2563eb; color: #ffffff; border: none; font-size: 15px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
            button:hover { background-color: #1d4ed8; }
            </style>
        </head>
        <body>
            <div class="card">
            <h2>${pageTitle}</h2>
            <form action="/api/v1/workflows/trigger/${slug}" method="POST">
                ${renderedInputs}
                <button type="submit">Submit</button>
            </form>
            </div>
        </body>
        </html>`;
        return res.setHeader("Content-Type","text/html").send(htmlPage);
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message:"An error occured while loading the form."
        })
    }
    
}   
