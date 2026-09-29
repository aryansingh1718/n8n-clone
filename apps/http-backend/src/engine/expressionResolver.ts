import { NodeItem } from "../nodes/types";

function getNestedValue(obj:any,path:string){
    return path.split('.').reduce((acc, part) => acc?.[part],obj);
}

function evaluateSingleExpression(expression:string,item:NodeItem){
    const trimmed = expression.trim();
    if(trimmed.startsWith('$json.')){
        const path = trimmed.substring(6);
        return getNestedValue(item.json,path);
    }

    if(trimmed === '$now')
        return new Date();
    
    return null;
}

export function expressionResolver(params:Record<string,any>,
    items:NodeItem[]
){
    const targetItem = items[0] || {json:{}};
    const resolved:Record<string,any> = {};

    for(const key of Object.keys(params)){
        const value = params[key];
        if(typeof value != "string"){
            resolved[key] = value;
            continue;
        }
        if(value.startsWith("{{") && value.endsWith("}}")){
            const innerContent = value.slice(2,-2);
            const hasNoOtherBraces = !innerContent.includes("{{");
            if(hasNoOtherBraces){
                resolved[key] = evaluateSingleExpression(innerContent,targetItem);
                continue;
            }
        }

        let result = value;
        while(result.includes("{{") && result.includes("}}")){
            const openIndex = result.indexOf("{{");
            const closeIndex = result.indexOf("}}");
            
            if(closeIndex<openIndex)
                break;
            const expression = result.slice(openIndex+2,closeIndex);
            const realValue = evaluateSingleExpression(expression,targetItem);
            const replacement = realValue != undefined ? String(realValue) :  `{{${expression}}}`;
            result = result.slice(0,openIndex) + replacement + result.slice(closeIndex+2);
        }
        resolved[key] = result;
    }
    return resolved;
}   
