import { nodeRegistry } from "../nodes/nodeRegistry";
import { NodeItem , NodeType , WorkFlowNode , WorkFlowEdge} from "../nodes/types";

export async function executeWorkFlow(nodes:WorkFlowNode[],edges:WorkFlowEdge[]){
    const outputs: Record<string,NodeItem[]> = {};
    const nodeResults: Record<string,{
        status:string,
        outputs?:NodeItem[],
        error?:string
    }> = {};

    const startNode =   nodes.find((n) => {
        return !edges.some(e => e.target === n.id)
    });
    if(!startNode){
        throw new Error("No starting node found");
    }

    const queue: WorkFlowNode[] = [startNode];
    const visited = new Set<string>();

    while(queue.length > 0){
        const currentNode = queue.shift()!;
        if(visited.has(currentNode.id))
            continue;
        visited.add(currentNode.id);

        const incomingEdges = edges.filter(e => e.target === currentNode.id);
        const incomingItems: NodeItem[] = incomingEdges.length > 0 ?
            incomingEdges.flatMap(e => outputs[e.source] ?? []):
            []
        
        const nodeImplementation = nodeRegistry[currentNode.type];
        if(!nodeImplementation){
            nodeResults[currentNode.id] = {status:"failed",error:`Node type ${currentNode.type} not found`};
            continue;
        }

        try{
            const result = await nodeImplementation.execute(incomingItems,currentNode.params);
            outputs[currentNode.id] = result;
            nodeResults[currentNode.id] = {
                status:"success",
                outputs:result,
            }
        }
        catch{
            nodeResults[currentNode.id] = {status:"failed",error:`Error occurred while executing node ${currentNode.id} and ${currentNode.type}`};
            continue;
        }

        const outgoingEdges = edges.filter(e => e.source === currentNode.id);
        outgoingEdges.map((e) => {
            const nextNode = nodes.find(n => n.id === e.target);
            if(nextNode){
                queue.push(nextNode);
            }
        })
    }
    return {outputs,nodeResults};
}   