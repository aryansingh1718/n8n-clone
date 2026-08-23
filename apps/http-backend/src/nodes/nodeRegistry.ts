import { manualTriggerNode } from "./manualTriggerNode";
import { httpRequestNode } from "./httpRequestNode";
import type { NodeType } from "./types";
import { httpParams } from "./httpRequestNode";

export const nodeRegistry: Record <string,NodeType<any>> = {
    manualTrigger:manualTriggerNode,
    httpRequest:httpRequestNode
}