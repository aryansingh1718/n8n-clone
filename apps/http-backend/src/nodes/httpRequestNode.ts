import { NodeType } from "./types";
import axios from "axios";

export const httpRequestNode:NodeType = {
    name:"httpRequest",
    displayName:"HTTP Request",
    execute:async (items,params) => {
        const response = await axios.get(params.url);
        const data = response.data;
        return [{
            json:data
        }];
    }
}