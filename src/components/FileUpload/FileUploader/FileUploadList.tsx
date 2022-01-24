import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import {
  IFileUploadListProps,
  IFileInfo,
  FILE_UPLOAD_CONSTANTS,
  FileUploadError,
  FILE_UPLOAD_ERRORS,
  FileUploadState
} from '..';
import { fileUploaderStyles } from './FileUploader.styles';
import {
  IColumn,
  Icon,
  ProgressIndicator,
  IconButton,
  DetailsList,
  Link
} from '@fluentui/react';
import { mergeClassNames} from '../../../'

const useStyles = createUseStyles(fileUploaderStyles);

export const FileUploadList: React.FC<IFileUploadListProps> = (props) => {
  const classes = useStyles();

  const getColumns = () => {
    let columns: IColumn[] = [
      {
        key: '2',
        name: 'Document Name',
        fieldName: 'DocumentName',
        minWidth: 350,
        maxWidth: 350,
        isResizable: true,
        isRowHeader: true,
        onRender: (item: IFileInfo) => {
          if (props.onRenderFileNameColumn) {
            return props.onRenderFileNameColumn(item);
          }
          return props.onDownLoad ? (
            <>
              <Icon iconName="Page" />
              <Link                
                onClick={() => {
                  props.onDownLoad && props.onDownLoad(item);
                }}
                className={classes.gridfileRowContainer}
              >{item.name}</Link>
            </>
          ) : (
            <span>
              <Icon iconName="Page" /> {item.name}
            </span>
          );
        }
      }
    ];
    if (!props.hideFileUploadStatus) {
      columns.push({
        key: '3',
        name: 'Status',
        fieldName: 'Status',
        minWidth: 200,
        maxWidth: 200,
        isResizable: true,
        isRowHeader: true,
        onRender: (item: IFileInfo) => {
          return (
            <>
              {item.uploadState === FileUploadState.InProgress ? (
                <div className={classes.progressIndicator}>
                  {item.uploadState === FileUploadState.InProgress && <ProgressIndicator />}
                </div>
              ) : (
                <>
                  {item.uploadError !== FileUploadError.None && (
                    <div className={classes.gridfileRowContainer}>
                      <Icon className={classes.errorIcon} iconName="Error" title="Error" />
                      <span className={classes.errorText}>
                        {FILE_UPLOAD_ERRORS[item.uploadError]}
                      </span>
                    </div>
                  )}
                  {item.uploadState === FileUploadState.Complete && (
                    <div className={classes.gridfileRowContainer}>
                      <Icon
                        className={classes.successIcon}
                        iconName="Completed"
                        title="Completed"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          );
        }
      });
    }
    if (props.onRemove) {
      columns.push({
        key: '4',
        name: 'Action',
        fieldName: 'Delete',
        minWidth: 35,
        maxWidth: 35,
        isResizable: true,
        isRowHeader: true,
        onRender: (item: IFileInfo) => {
          return (
            <IconButton
              ariaLabel="Delete"
              iconProps={{iconName: "Delete"}} 
              onClick={() => props.onRemove && props.onRemove(item)}
            />
          );
        }
      });
    }
    return columns;
  };

  return (
    <div className={mergeClassNames([classes.fileListContainer, props.fileListContainerClass])}>
      <DetailsList
        className={mergeClassNames([classes.fileListGrid, props.fileListGridClass])}
        columns={getColumns()}
        items={props.selectedFiles}
      />
    </div>
  );
};
