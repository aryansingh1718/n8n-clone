import { manualTriggerNode } from "./manualTriggerNode";
import { httpRequestNode } from "./httpRequestNode";
import type { NodeType } from "./types";

export const nodeRegistry: Record <string,NodeType> = {
    manualTrigger:manualTriggerNode,
    httpRequest:httpRequestNode
}