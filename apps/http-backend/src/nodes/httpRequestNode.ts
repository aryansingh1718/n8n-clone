import { NodeType } from "./types";
import axios from "axios";
import { NodeItem } from "./types";

export type httpParams = {
    url:string;
    method:"GET" | "POST" | "DELETE";
    bodyMapping?:Record<string,string>;
    queryMapping?: Record<string, string>;
}

function getByPath(source: any, path: string) {
    const keys = path.split(".");
    let current = source;

    for (const key of keys) {
        if (current == null) {
            return undefined;
        }

        current = current[key];
    }

    return current;
}

function buildBody(incomingItems:NodeItem[],mapping?:Record<string,string>){
    if(!mapping)
        return incomingItems[0] ?? {};
    const source = incomingItems[0];
    const body : Record<string, any> = {};
    for(const [key,path] of Object.entries(mapping)){
        body[key] = getByPath(source,path);
    }
    return body;
}

function buildQueryParams(incomingItems: NodeItem[], mapping?: Record<string, string>) {
    if (!mapping) 
        return {};
    const source = incomingItems[0];
    const params: Record<string, any> = {};
    for (const [key, path] of Object.entries(mapping)) {
        params[key] = getByPath(source, path);
    }
    return params;
}

export const httpRequestNode:NodeType<httpParams> = {
    name:"httpRequest",
    displayName:"HTTP Request",
    execute:async (items,params) => {
        const body = (params.method != "GET" && params.method != "DELETE") 
        ? buildBody(items,params.bodyMapping) 
        : {};
        const queryParams = (params.method == "GET")
        ? buildQueryParams(items,params.queryMapping)
        :{};

        let response;
        if(params.method == "POST"){
             response = await axios.post(params.url , body);
        }
        else if(params.method == "GET") {
            response = await axios.get(params.url , {params:queryParams});
        }
        else if(params.method == "DELETE"){
            response = await axios.delete(params.url , {params:queryParams});
        }

        if(!response){
            throw new Error(`Unsupported HTTP method: ${params.method}`);
        }
        const data = response.data;
        return [{
            json:data
        }];
    }
}