import React from 'react';
import { FileUploader, FILE_EXTENSIONS, IFileInfo, FileUploaderType, FileUploadState } from '..';
import { parseExcelFileToJSON } from '../fileParsers';
import { ProgressIndicator } from '@fluentui/react';

export const FileUploaderExample = () => {
  const [files, setFiles] = React.useState<IFileInfo[]>();
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

  const onChange = (files: IFileInfo[]) => {
    setFiles(files);
    console.log(files);
  };
  const onDownload = (files: IFileInfo[]) => {
    console.log(files);
  };

  const onRenderFileNameColumn = (item: IFileInfo) => {
    return (
      <>
        <span>{item.name}</span>
        {item.uploadState === FileUploadState.InProgress && <ProgressIndicator />}
      </>
    );
  };

  return (
    <>
      <FileUploader
        uploaderType={FileUploaderType.DropZone}
        maxFiles={10}
        fileTypes={[FILE_EXTENSIONS.CSV, FILE_EXTENSIONS.XLS, FILE_EXTENSIONS.XLSX]}
        onChange={onChange}
        onDownload={onDownload}
        fileUploadListHeight={500}
        // fileParsers={parsers} //pass it if you want to parse the files and convert to JSON
        // onRenderFileNameColumn={onRenderFileNameColumn}
      />
    </>
  );
};
