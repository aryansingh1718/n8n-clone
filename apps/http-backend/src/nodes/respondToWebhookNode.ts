import { setWebhookResponse } from "../store/webhookResponseStore";
import { NodeItem, NodeType } from "./types";

export type RespondToWebhookParams = {
    statusCode?: number;
    responseBody?: Record<string, any>;
};

export const respondToWebhookNode:NodeType = {
    name:"respondToWebhook",
    displayName:"Respond To Webhook",
    execute: async(items:NodeItem[],params:Record<string,any>, context:any ) => {
        const statusCode = params.statusCode || 200;
        const body = params.responseBody || items[0]?.json || {success:true};
        setWebhookResponse(context.executionId,statusCode,body);
        return items;
    }
}