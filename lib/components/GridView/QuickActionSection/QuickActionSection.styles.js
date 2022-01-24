export const quickActionSectionStyles = (theme) => ({
    quickActionSectionLeft: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
        // marginLeft: '10px'
    },
    quickActionSectionRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    quickActionChildren: {},
    quickActionColPicker: {},
    columnListCallout: {},
    quickActionFilter: {},
    quickActionSearch: {},
    borderlessButton: {
        fontWeight: 'normal',
        border: 'none',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
        color: 'black',
        paddingRight: '5px',
        paddingLeft: '10px',
        '&:hover': {
            color: '#0078d4'
        },
        '& i': {
            color: '#0078d4',
            '&:hover': {
                color: '#0078d4'
            }
        },
        '& .ms-Button-label': {
            fontWeight: 'normal'
        }
    },
    exportButton: {
        height: '30px'
    }
});
