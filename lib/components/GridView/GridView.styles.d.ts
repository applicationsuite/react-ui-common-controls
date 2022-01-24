export declare const gridViewStyles: (theme: string) => {
    gridView: {
        display: string;
        flexDirection: string;
        background: string;
    };
    gridViewtopSection: {
        justifyContent: string;
        padding: string;
    };
    gridViewSection: {
        borderTop: string;
    };
    gridViewData: {
        '& .ms-DetailsList-contentWrapper': {};
    };
    gridViewNoData: {
        '& .ms-DetailsList-contentWrapper': {
            minHeight: string;
        };
    };
    noResults: {
        marginTop: string;
        marginBottom: string;
        fontSize: number;
    };
    noResultsIcon: {
        marginTop: string;
        fontSize: string;
    };
    gridViewResultCount: {};
    gridViewPager: {};
    filterToolbar: {
        display: string;
        justifyContent: string;
        alignItems: string;
        paddingTop: string;
        paddingBottom: string;
    };
    listStyles: {
        '& .ms-DetailsHeader': {
            paddingTop: number;
            background: string;
        };
        '& .ms-DetailsRow': {
            '&:hover': {
                background: string;
            };
        };
        '& .ms-DetailsRow-fields': {
            fontSize: string;
            color: string;
            '& .is-row-header': {
                fontSize: string;
            };
        };
    };
    groupedListStyles: {
        '& .ms-GroupHeader': {
            backgroundColor: string;
            border: string;
        };
        '& .ms-GroupHeader-title': {
            fontWeight: number;
        };
    };
    checkBoxEvent: {
        pointerEvents: string;
    };
};
