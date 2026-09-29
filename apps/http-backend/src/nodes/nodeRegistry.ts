import { manualTriggerNode } from "./manualTriggerNode";
import { httpRequestNode } from "./httpRequestNode";
import type { NodeType } from "./types";
import { webhookNode } from "./webhookNode";
import { noOperationNode } from "./noOpNode";
import { setNode } from "./setNode";

export const nodeRegistry: Record <string,NodeType> = {
    manualTrigger:manualTriggerNode,
    webhook:webhookNode,
    httpRequest:httpRequestNode,
    noOp:noOperationNode,
    set:setNode
}