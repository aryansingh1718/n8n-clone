const webhookResponses = new Map<string,{
    statusCode: number;
    body:any
}>();

export function setWebhookResponse(
    executionId:string,
    statusCode:number,
    body:any
){
    webhookResponses.set(executionId,{statusCode,body});
}

export function getWebhookResponse(executionId:string){
        const response = webhookResponses.get(executionId);
        webhookResponses.delete(executionId);
        return response;
    }