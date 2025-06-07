declare global {
    interface Window {
        injectMap: Map<string, (param: string) => void>;
        injectFunc: (cmd: string, data: string) => void;
        sendBack: (cmd: string, data: string) => void;
        invokeCSharpAction: (data: string) => void;
    }
}


export function init() {

    if (window.injectMap)
        return;

    window.injectMap = new Map<string, (param: string) => void>()

    window.injectFunc = (cmd: string, data: string) => {
        const func = window.injectMap.get(cmd);
        if (func) {
            func(data);
            console.log("registered call func: ", cmd, data.substring(0, 100));
        }
        else {
            console.log("!unregistered call func: ", cmd, data.substring(0, 100));
        }
    }

    window.sendBack = (cmd: string, data: any) => {
        const obj = { cmd, data };
        const json = JSON.stringify(obj);
        window.invokeCSharpAction(json)
    }
}

function setFunc(key: string, func: (param: string) => void) {
    window.injectMap.set(key, func);
}

function remFunc(key: string) {
    window.injectMap.delete(key);
}


export function getValue(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const uniqNumber = Math.floor(Math.random() * 100000000);
        const param = { returnID: uniqNumber, key };
        setFunc(uniqNumber.toString(), (param: string) => {
            remFunc(uniqNumber.toString());
            resolve(param);
        });
        window.sendBack("getValue", JSON.stringify(param));
        setTimeout(() => {
            reject(new Error("timeout"));
        }, 3000);
    });
}


export function setValue(key: string, value: any) {
    window.sendBack("setValue", JSON.stringify({ key, value }));
}
