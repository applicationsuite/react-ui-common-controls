import { IMicroFrontEndInfo, IMicroFrontEndProps } from './MicroFrontEnd.models';
export declare const loadMicroFrontEndJss: (microFrontEndInfo: IMicroFrontEndInfo, manifest: any) => void;
export declare const loadMicroFrontEndCSS: (microFrontEndInfo: IMicroFrontEndInfo, manifest: any) => void;
export declare const getMainJSFilePath: (hostUrl: string, manifest: any) => string;
export declare const getMainCSSFilePath: (hostUrl: string, manifest: any) => string;
export declare const getMicroFrontEndDetails: (props: IMicroFrontEndProps) => IMicroFrontEndInfo;
export declare const loadMicroFrontEndManifest: (microFrontEndInfo: IMicroFrontEndInfo) => Promise<void>;
export declare const loadMicroFrontEnd: (state: IMicroFrontEndInfo) => void;
export declare const unloadMicroFrontEnd: (props: IMicroFrontEndProps, state: IMicroFrontEndInfo) => void;
