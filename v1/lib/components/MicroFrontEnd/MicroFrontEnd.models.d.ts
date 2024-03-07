export declare const MICROFONTEND_RESOURCES: {
    MAIN_JS: string;
    MAIN_CSS: string;
};
export declare enum ScriptLoadStatus {
    NotStarted = "NotStarted",
    Complete = "Complete"
}
export interface IMicroFrontEndProps {
    hostUrl: string;
    hostName: string;
    history: any;
    userInfo?: any;
    data?: any;
    showErrorOnLoadFailure?: boolean;
    onNotify?: (data: any) => void;
    onLoadComplete?: (error: string) => void;
}
export interface IMicroFrontEndContext {
    userInfo: any;
    history: any;
    data?: any;
    notify?: (data: any) => void;
}
export interface IMicroFrontEndInfo extends IMicroFrontEndProps {
    scriptId: string;
    assetFile: string;
    mountEventName: string;
    unmountEventName: string;
    containerName: string;
    jsScriptName: string;
    cssScriptName: string;
    status?: ScriptLoadStatus;
    error?: string;
}
