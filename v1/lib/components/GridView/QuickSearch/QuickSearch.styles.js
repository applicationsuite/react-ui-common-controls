export const quickSearchStyles = (theme) => ({
    quickSearch: {
        display: 'flex',
        width: '265px'
    },
    quickSearchWithoutButton: {
        width: '270px'
    },
    quickSearchBox: {
        width: '265px',
        height: '32px !important'
    },
    quickSearchButton: {
        height: '32px !important',
        backgroundColor: '#0078d4',
        color: 'white',
        '&:hover': {
            color: 'white',
            backgroundColor: '#0078d4'
        },
        '>i': {
            color: 'white'
        }
    }
});
