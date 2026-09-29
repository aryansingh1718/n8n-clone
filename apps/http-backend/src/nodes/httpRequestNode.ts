import { NodeType } from "./types";
import axios from "axios";

export type httpParams = {
    url:string;
    method:"GET" | "POST" | "DELETE";
    body?:Record<string,any>;
    queryParams?:Record<string,any>;
}

export const httpRequestNode:NodeType = {
    name:"httpRequest",
    displayName:"HTTP Request",
    execute:async (items,params) => {
        let response;
        if(params.method === "POST")
            response = await axios.post(params.url,params.body);
        else if(params.method === "GET")
            response = await axios.get(params.url,{params:params.queryParams});
        else if(params.method === "DELETE")
            response = await axios.delete(params.url,{params:params.queryParams});
        else
            throw new Error(`Unsupported HTTP method: ${params.method}`);
        return [{
            json:response.data
        }] 
    }
}