import { nodeRegistry } from "../nodes/nodeRegistry";
import { NodeItem , WorkFlowNode , WorkFlowEdge, ExecutionContext} from "../nodes/types";
import { expressionResolver } from "./expressionResolver";

export async function executeWorkFlow(nodes:WorkFlowNode[],edges:WorkFlowEdge[],initialData:NodeItem[] = [],executionId:string){
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
            initialData
        
        const nodeImplementation = nodeRegistry[currentNode.type];
        if(!nodeImplementation){
            nodeResults[currentNode.id] = {status:"failed",error:`Node type ${currentNode.type} not found`};
            continue;
        }
        
        const context: ExecutionContext = {
            workflowId: "unknown", 
            executionId: executionId,
            currentNodeId: currentNode.id
        };

        try{
            const resolvedParams = expressionResolver(currentNode.params,incomingItems);
            const result = await nodeImplementation.execute(incomingItems,resolvedParams,context);
            outputs[currentNode.id] = result;
            nodeResults[currentNode.id] = {
                status:"success",
                outputs:result,
            }
        }
        catch(err){
            nodeResults[currentNode.id] = {
                status:"failed",
                error: err instanceof Error ? err.message : String(err)
            };
            break;
        }

        const outgoingEdges = edges.filter(e => e.source === currentNode.id);
        outgoingEdges.map((e) => {
            const nextNode = nodes.find(n => n.id === e.target);
            if(nextNode){
                queue.push(nextNode);
            }
        })
    }
    for (const node of nodes) {
            if (!nodeResults[node.id]) {
                nodeResults[node.id] = { 
                    status: "skipped" 
                };
            }
        }
    return {outputs,nodeResults};
}   