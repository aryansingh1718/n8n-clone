import { NodeType } from "./types";

export const manualTriggerNode:NodeType = {
    name:"manualTrigger",
    displayName:"Manual Trigger",
    execute: async() => {
        return [{json:{
            message:"Workflow Started!"
        }}]
    }
}