export const gridViewStyles = (theme: string) => ({
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
  fliterGridContainer: {
    display: 'flex'
  },
  loadingSection: {
    margin: '10px',
    padding: '2px',
    '& > .ms-Shimmer-container': {
      margin: '10px 0'
    }
  },
  filtersSection: {
    width: '20%',
    marginLeft: '10px',
    paddingRight: '10px',
    marginRight: '12px',
    borderRight: '1px solid lightgrey'
  },
  borderRight: {
    borderRight: '1px solid lightgrey'
  },
  gridViewWithoutFilters: {
    width: '100%'
  },
  gridViewWithFilters: {
    width: '80%'
  },
  filtersHeader: {
    fontSize: '18px',
    fontWeight: 550,
    margin: '10px 3px 10px 3px',
    borderBottom: '1px solid lightgrey',
    paddingBottom: '12px'
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
  },
  gridviewAddSection: {
    padding: '10px'
  },
  gridviewActionColumnButton: {
    padding: '5px',
    marginRight: '5px'
  }
});
