export interface NodeItem {
    json:Record<string,any>
};

export interface NodeType{
    name: string;
    displayName: string;
    execute: (items: NodeItem[], params:Record<string, any>) => Promise<NodeItem[]>
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