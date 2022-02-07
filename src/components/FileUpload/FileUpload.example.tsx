import React from 'react';
import { FileUpload, FILE_EXTENSIONS, IFileInfo } from '.';
import { parseExcelFileToJSON } from './fileParsers';
import { PrimaryButton } from '@fluentui/react';

export const FileUploadExample = () => {
  const [files, setFiles] = React.useState<IFileInfo[]>();
  const triggerFileLoadRef: any = React.createRef();
  const parsers = {
    [FILE_EXTENSIONS.XLSX]: (fileContent: any) => {
      return parseExcelFileToJSON(fileContent);
    },
    [FILE_EXTENSIONS.CSV]: (fileContent: any) => {
      return parseExcelFileToJSON(fileContent);
    },
    [FILE_EXTENSIONS.XLS]: (fileContent: any) => {
      return parseExcelFileToJSON(fileContent, [{ Name: 'Name' }, { Age: 'Age' }]);
    }
  };

  const onChange = (files: IFileInfo[], e: any) => {
    setFiles(files);
    console.log(files);
  };

  const onValidate = (files: IFileInfo[]) => {
    return true;
  };

  const onLoad = (files: IFileInfo[]) => {
    console.log(files);
  };

  const onUploadClick = () => {
    triggerFileLoadRef.current(files);
    setFiles(undefined);
  };

  return (
    <>
      <FileUpload
        maxFiles={1}
        fileTypes={[FILE_EXTENSIONS.CSV, FILE_EXTENSIONS.XLS, FILE_EXTENSIONS.XLSX]}
        fileParsers={parsers}
        onChange={onChange}
        onValidate={onValidate}
        onLoad={onLoad}
        //triggerFileLoadRef={triggerFileLoadRef}
      />
      {/* <PrimaryButton text="Upload" onClick={onUploadClick} /> */}
    </>
  );
};
