import React from 'react';

export const getFile = async (fileName: string, baseUrl?: string) => {
  return fetch((baseUrl ? baseUrl : window.location.origin) + '/' + fileName)
    .then((response) => response.json())
    .catch((error) => console.log('Error in loading Config file'));
};

export const useFile = (file: string) => {
  const [fileData, setFileData] = React.useState();
  React.useEffect(() => {
    (async () => {
      setFileData(await getFile(file));
    })();
  }, [file]);
  return fileData;
};
