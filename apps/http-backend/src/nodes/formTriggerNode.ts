import { NodeItem, NodeType } from "./types";

export const formTriggerNode:NodeType = {
    name:"formTrigger",
    displayName:"Form Trigger",
    execute: async(items:NodeItem[], params:Record<string, any>)=>{
        return items;   
    }
}