export const fileUploaderStyles = (theme) => ({
    fileUploader: {},
    fileDropZone: {
        position: 'relative',
        height: 120,
        width: '100%',
        textAlign: 'center',
        borderRadius: 2,
        background: 'grey'
    },
    fileDropZoneActive: {
        position: 'relative',
        height: 120,
        width: '100%',
        textAlign: 'center',
        background: 'grey',
        border: `3px dotted blue`,
        borderRadius: 2,
        opacity: 0.7
    },
    browseLink: {
        fontSize: '14px'
    },
    downIcon: {
        color: '#F3F2F1',
        marginTop: '48px'
    },
    attachIcon: {
        color: '#F3F2F1',
        marginTop: '48px'
    },
    initialText: {
        color: 'black',
        paddingLeft: 8
    },
    initialTextActive: {
        color: '#F3F2F1',
        paddingLeft: 8
    },
    selectFile: {
        color: 'black',
        paddingLeft: 16,
        paddingRight: 16
    },
    linkItem: {
        fontSize: '14px'
    },
    fileRowContainer: {
        paddingTop: 23
    },
    circleFillIcon: {
        color: '#BBBBBB',
        fontSize: '6px'
    },
    progressIndicator: {
        '& .ms-ProgressIndicator-itemProgress': {
            width: '40%'
        }
    },
    errorSection: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    successIcon: {
        color: 'green'
    },
    errorIcon: {
        color: 'red',
        marginRight: '5px'
    },
    errorText: {
        color: 'red',
        marginLeft: '5px'
    },
    gridfileRowContainer: {
        paddingTop: '5px',
        fontSize: '14px',
        padding: '4px'
    },
    fileListContainer: {},
    fileListGrid: {}
});
