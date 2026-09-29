import { NodeType, NodeItem } from "./types";
import vm from "node:vm";

export const codeNode: NodeType = {
    name: "code",
    displayName: "Code",
    
    execute: async (items: NodeItem[], params: Record<string, any>) => {
        const userCode = params.code || "return items;";

        const sandbox = {
            items: JSON.parse(JSON.stringify(items)),
            console: {
                log: (...args: any[]) => console.log("[Code Node]:", ...args)
            }
        };

        const scriptText = `(async () => { ${userCode} })()`;
        
        const context = vm.createContext(sandbox);
        const script = new vm.Script(scriptText);

        try {
            const result = await script.runInContext(context, { timeout: 2000 });

            if (Array.isArray(result)) {
                return result;
            }
            
            if (result && typeof result === "object") {
                return [{ json: result }];
            }

            if (result === undefined || result === null) {
                return items;
            }

            return [{ json: { value: result } }];
        } 
        catch (err) {
            if (err instanceof Error && err.message.includes("timed out")) {
                throw new Error("Code node execution timed out after 2 seconds");
            }
            throw err;
        }
    }
};