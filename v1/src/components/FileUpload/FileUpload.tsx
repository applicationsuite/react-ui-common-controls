import React, { useImperativeHandle } from 'react';
import { IFileUploadProps, IFileInfo } from './FileUpload.models';
import { loadFiles, getUpdatedFiles } from './fileUploadUtils';

export const FileUpload: React.FC<IFileUploadProps> = (props) => {
  useImperativeHandle(props.triggerFileLoadRef, () => triggerFileLoad, []);

  const onChange = async (e: any) => {
    e.preventDefault();
    let files: IFileInfo[] = getUpdatedFiles(
      e.target.files,
      props.fileTypes,
      props.maxFileSize,
      props.selectedFiles
    );
    const maxFiles = props.maxFiles || 1;
    if (files.length > maxFiles) {
      files.splice(maxFiles, files.length);
    }

    if (!(files && files.length > 0)) {
      return;
    }
    props.onChange && props.onChange(files, e);

    //Any Custom validation
    if (props.onValidate && !props.onValidate(files)) {
      return;
    }
    if (!props.onLoad) {
      return;
    }
    if (props.triggerFileLoadRef) {
      return;
    }
    const filesContent = await loadFiles(files, props.fileParsers);
    props.onLoad!(filesContent);
  };

  const triggerFileLoad = async (files: IFileInfo[]) => {
    if (!(files && files.length > 0)) {
      return;
    }
    if (!props.onLoad) {
      return;
    }
    const filesContent = await loadFiles(files, props.fileParsers);
    props.onLoad!(filesContent);
  };

  const getFileExtensions = () => {
    if (props.fileTypes && props.fileTypes.length) {
      return props.fileTypes.join(',');
    } else {
      return '';
    }
  };
  const fileUploadClick = (e: any) => {
    e.target.value = null;
  };

  return (
    <>
      <input
        id={props.id}
        type="file"
        name={props.name}
        ref={props.ref}
        style={props.style}
        aria-label={props.ariaLabel}
        multiple={(props.maxFiles || 1) > 1}
        accept={getFileExtensions()}
        onChange={onChange}
        onClick={fileUploadClick}
        className={props.className}
      />
    </>
  );
};
