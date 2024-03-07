export const filterTagStyles = (theme) => ({
    filterContainer: {
        display: 'flex',
        height: '100%',
        width: '100%',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    filterCss: {
        margin: '0 4px'
    },
    filterTags: {
        backgroundColor: '#f8fafa',
        marginRight: '10px',
        marginBottom: '10px',
        padding: '2px 0px 2px 8px',
        display: 'flex',
        alignItems: 'center',
        height: '32px'
    },
    filterDialog: {
        minWidth: '300px',
        paddingLeft: '15px',
        paddingRight: '15px',
        paddingBottom: '20px',
        '& .ms-Callout-main': {
            overflow: 'hidden !important'
        }
    },
    applyBtn: {
        marginTop: '20px',
        marginLeft: '6px',
        marginRight: '10px'
    },
    filterDetails: {
        color: 'black !important',
        fontSize: '14px',
        marginRight: '8px',
        display: 'inline-flex',
        lineHeight: '20px',
        textDecoration: 'none !important',
        '&:hover': {
            color: '#0078d4 !important',
            textDecoration: 'none !important'
        }
    },
    filterTagsClose: {
        fontSize: '14px',
        padding: '7px',
        display: 'flex',
        border: 'none',
        background: 'none',
        '& i': {
            cursor: 'pointer'
        },
        '&:hover': {
            color: '#0d6efd'
        }
    },
    filterText: {
        display: 'inline-flex',
        marginBottom: '14px',
        alignItems: 'center'
    },
    filterTagVal: {
        fontWeight: 500,
        paddingLeft: '5px',
        textDecoration: 'none !important',
        color: ''
    },
    borderlessButton: {
        border: 'none',
        marginTop: '-10px',
        paddingLeft: '5px',
        paddingRight: '5px',
        color: 'black',
        '& .ms-Button-label': {
            fontWeight: 'normal'
        },
        '&:hover': {
            color: '#0078d4 !important'
        },
        '& i': {
            color: '#0078d4',
            '&:hover': {
                color: '#0078d4'
            }
        }
    }
});
