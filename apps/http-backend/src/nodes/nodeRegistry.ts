import { manualTriggerNode } from "./manualTriggerNode";
import { httpRequestNode } from "./httpRequestNode";
import type { NodeType } from "./types";
import { webhookNode } from "./webhookNode";

export const nodeRegistry: Record <string,NodeType<any>> = {
    manualTrigger:manualTriggerNode,
    webhook:webhookNode,
    httpRequest:httpRequestNode
}