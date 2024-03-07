export const paginationStyles = (theme) => ({
    pagination: {
        width: '100%',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paginationRight: {
        textAlign: 'right',
        justifyContent: 'space-between',
        marginTop: '20px',
        paddingRight: '10px'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    pages: {
        display: 'flex'
    },
    dropdown: {
        paddingLeft: '10px',
        width: '64px'
    },
    summary: {
        paddingLeft: '10px',
        paddingTop: '4px'
    },
    page: {
        backgroundColor: 'transparent',
        border: 'none',
        ':focus': {
            border: 'none !important'
        },
        ':hover': {
            border: '1px solid !important'
        }
    },
    selectedPage: {
        border: '1px solid !important',
        backgroundColor: 'transparent',
        ':focus': {
            border: '1px solid !important'
        }
    }
});
