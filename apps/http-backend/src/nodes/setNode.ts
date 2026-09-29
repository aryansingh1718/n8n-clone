import { NodeItem, NodeType } from "./types";

export const setNode:NodeType = {
    name:"Set",
    displayName:"Set",
    execute:async (items:NodeItem[] , params:Record<string,any>) => {
        const valuesToAdd = params.value || {};
        return items.map((item) => {
            return {
                json:{
                ...item.json,
                ...valuesToAdd
            }}
        })
    }
}