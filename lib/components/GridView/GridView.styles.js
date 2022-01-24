export const gridViewStyles = (theme) => ({
    gridView: {
        display: 'flex',
        flexDirection: 'column',
        background: 'white'
    },
    gridViewtopSection: {
        justifyContent: 'space-between',
        padding: '5px 10px 5px 10px'
    },
    gridViewSection: {
        borderTop: `1px solid`
    },
    gridViewData: {
        '& .ms-DetailsList-contentWrapper': {
        // minHeight: '400px'
        }
    },
    gridViewNoData: {
        '& .ms-DetailsList-contentWrapper': {
            minHeight: '10px'
        }
    },
    noResults: {
        marginTop: '10px',
        marginBottom: '10px',
        fontSize: 18
    },
    noResultsIcon: {
        marginTop: '20px',
        fontSize: '40px'
    },
    gridViewResultCount: {},
    gridViewPager: {},
    filterToolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: '10px',
        paddingBottom: '10px'
    },
    listStyles: {
        '& .ms-DetailsHeader': {
            paddingTop: 0,
            background: 'transparent'
        },
        '& .ms-DetailsRow': {
            '&:hover': {
                background: '#F3F2F1'
            }
        },
        '& .ms-DetailsRow-fields': {
            fontSize: '14px',
            color: 'black',
            '& .is-row-header': {
                fontSize: '14px'
            }
        }
    },
    groupedListStyles: {
        '& .ms-GroupHeader': {
            backgroundColor: 'white',
            border: 'none'
        },
        '& .ms-GroupHeader-title': {
            fontWeight: 500
        }
    },
    checkBoxEvent: {
        pointerEvents: 'none'
    }
});
