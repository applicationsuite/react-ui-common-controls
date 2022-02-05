import {
  IMicroFrontEndInfo,
  IMicroFrontEndProps,
  IMicroFrontEndContext,
  MICROFONTEND_RESOURCES,
  ScriptLoadStatus
} from './MicroFrontEnd.models';

export const loadMicroFrontEndJss = (microFrontEndInfo: IMicroFrontEndInfo, manifest: any) => {
  const script = document.createElement('script');
  script.id = microFrontEndInfo.jsScriptName;
  document.head.appendChild(script);
  script.onload = () => {
    loadMicroFrontEnd(microFrontEndInfo);
    microFrontEndInfo.onLoadComplete && microFrontEndInfo.onLoadComplete('');
  };
  script.onerror = () => {
    microFrontEndInfo.onLoadComplete &&
      microFrontEndInfo.onLoadComplete('Error in loading microfront end manifest script file');
    console.log('Error in loading microfront end manifest script file');
  };
  script.src = getMainJSFilePath(microFrontEndInfo.hostUrl, manifest);
};

export const loadMicroFrontEndCSS = (microFrontEndInfo: IMicroFrontEndInfo, manifest: any) => {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.id = microFrontEndInfo.cssScriptName;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = getMainCSSFilePath(microFrontEndInfo.hostUrl, manifest);
  head.appendChild(link);
};

export const getMainJSFilePath = (hostUrl: string, manifest: any) => {
  return manifest.files
    ? `${hostUrl}${manifest.files[MICROFONTEND_RESOURCES.MAIN_JS]}`
    : `${hostUrl}${manifest[MICROFONTEND_RESOURCES.MAIN_JS]}`;
};
export const getMainCSSFilePath = (hostUrl: string, manifest: any) => {
  return manifest.files
    ? `${hostUrl}${manifest.files[MICROFONTEND_RESOURCES.MAIN_CSS]}`
    : `${hostUrl}${manifest[MICROFONTEND_RESOURCES.MAIN_CSS]}`;
};

export const getMicroFrontEndDetails = (props: IMicroFrontEndProps) => {
  const scriptId = (new Date().getUTCMilliseconds() + Math.floor(Math.random() * 1000)).toString();
  let microFrontEndInfo: IMicroFrontEndInfo = {
    hostName: props.hostName,
    hostUrl: props.hostUrl,
    scriptId: scriptId,
    assetFile: `${props.hostUrl}/asset-manifest.json`,
    mountEventName: `render${props.hostName}`,
    unmountEventName: `unmount${props.hostName}`,
    containerName: `${props.hostName}-container`,
    jsScriptName: `micro-frontend-script-${props.hostName}-${scriptId}`,
    cssScriptName: `micro-frontend-css-${props.hostName}-${scriptId}`,
    history: props.history,
    data: props.data,
    onNotify: props.onNotify,
    onLoadComplete: props.onLoadComplete,
    userInfo: props.userInfo
  };
  return microFrontEndInfo;
};

export const loadMicroFrontEndManifest = async (microFrontEndInfo: IMicroFrontEndInfo) => {
  fetch(microFrontEndInfo.assetFile)
    .then((res) => {
      return res.ok ? res.json() : undefined;
    })
    .then((manifest) => {
      loadMicroFrontEndJss(microFrontEndInfo, manifest);
      loadMicroFrontEndCSS(microFrontEndInfo, manifest);
    })
    .catch(() => {
      console.error('Error in loading microfront end manifest file');
      microFrontEndInfo.onLoadComplete &&
        microFrontEndInfo.onLoadComplete('Error in loading microfront end manifest file');
    });
};

export const loadMicroFrontEnd = (state: IMicroFrontEndInfo) => {
  if (state) {
    if (window[state.mountEventName]) {
      let contextData: IMicroFrontEndContext = {
        history: history,
        userInfo: state.userInfo,
        data: state.data,
        notify: state.onNotify
      };
      window[state.mountEventName](state.containerName, contextData);
    } else {
      state.onLoadComplete &&
        state.onLoadComplete(
          `Mount method is not provided for the [Microfrontend: ${state.hostName}]`
        );
      console.error(`Mount method is not provided for the [Microfrontend: ${state.hostName}]`);
    }
  }
};

export const unloadMicroFrontEnd = (props: IMicroFrontEndProps, state: IMicroFrontEndInfo) => {
  if (window[state.unmountEventName]) window[state.unmountEventName](state.containerName);
  //if javascript script is added to main html removing the same
  const jssElement: any = document.getElementById(state.jsScriptName);
  if (jssElement) {
    jssElement.parentNode &&
      jssElement.parentNode.removeChild &&
      jssElement.parentNode.removeChild(jssElement);
  }
  const cssElement: any = document.getElementById(state.cssScriptName);
  if (cssElement) {
    cssElement.parentNode &&
      cssElement.parentNode.removeChild &&
      cssElement.parentNode.removeChild(cssElement);
  }
};
