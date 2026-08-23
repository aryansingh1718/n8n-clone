export interface NodeItem {
    json:Record<string,any>
};

export interface NodeType<TParams = Record<string, any>> {
    name: string;
    displayName: string;
    execute: (items: NodeItem[], params: TParams) => Promise<NodeItem[]>
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