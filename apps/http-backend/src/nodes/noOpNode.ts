import { NodeItem, NodeType } from "./types";

export const noOperationNode:NodeType = {
    name:"noOp",
    displayName:"No operation",
    execute: async (items:NodeItem[],params:Record<string, any>) => {
        return items;
    }
} 