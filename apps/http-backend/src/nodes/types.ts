export interface NodeItem {
    json:Record<string,any>
};

export interface NodeType{
    name: string;
    displayName: string;
    execute: (items: NodeItem[], params:Record<string, any>,context:ExecutionContext) => Promise<NodeItem[]>
}

export interface ExecutionContext {
    executionId: string;
    [key: string]: any; 
}

export interface WorkFlowNode {
    id:string;
    type:string;
    params:Record<string,any>;
}

export interface WorkFlowEdge {
    source:string;
    target:string;
    sourceHandle?:boolean;
}