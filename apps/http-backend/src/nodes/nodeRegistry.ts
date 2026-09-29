import { manualTriggerNode } from "./manualTriggerNode";
import { httpRequestNode } from "./httpRequestNode";
import type { NodeType } from "./types";
import { webhookNode } from "./webhookNode";
import { noOperationNode } from "./noOpNode";
import { setNode } from "./setNode";
import { formTriggerNode } from "./formTriggerNode";
import { codeNode } from "./codeNode";

export const nodeRegistry: Record <string,NodeType> = {
    manualTrigger:manualTriggerNode,
    webhookTrigger:webhookNode,
    httpRequest:httpRequestNode,
    noOp:noOperationNode,
    set:setNode,
    formTrigger:formTriggerNode,
    code:codeNode
}