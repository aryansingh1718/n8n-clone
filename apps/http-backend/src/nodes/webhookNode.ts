import { NodeType } from "./types";

export const webhookNode:NodeType = {
    name:"webhook",
    displayName:"Webhook",
    execute:async(items,params) => {
        return items;
    }
}