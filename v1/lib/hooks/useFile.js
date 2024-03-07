var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
export const getFile = (fileName, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return fetch((baseUrl ? baseUrl : window.location.origin) + '/' + fileName)
        .then((response) => response.json())
        .catch((error) => console.log('Error in loading Config file'));
});
export const useFile = (file) => {
    const [fileData, setFileData] = React.useState();
    React.useEffect(() => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            setFileData(yield getFile(file));
        }))();
    }, [file]);
    return fileData;
};
