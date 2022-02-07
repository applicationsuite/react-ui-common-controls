import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { SORT_TYPE, HighlightText } from '../../';
import { GridViewType, FilterType, GridViewMessageType, FilterDataType, GridViewActionBarItems, QucickActionSectionAlignment } from './GridView.models';
import { getGridViewGroupsByFields } from './GridViewUtils';
import { GridView } from '.';
export const tempStyles = () => ({
    actionMenu: {
    // backgroundColor: 'green'
    // paddingLeft: '40px',
    // paddingRight: '12px'
    },
    gridSection: {
    // paddingLeft: '32px'
    },
    gridDataClass: {
    // maxHeight: '200px',
    // overflowY: 'scroll'
    }
});
const useStyles = createUseStyles(tempStyles);
export const GridViewExample = () => {
    const [items, setItems] = React.useState(getDocuments());
    const classes = useStyles();
    const sortingOptions = {
        sortType: SORT_TYPE.DESC,
        sortColumn: 'column3',
        sortField: 'dateModified'
    };
    const [selections, setSelection] = React.useState({
        sortingOptions: [sortingOptions]
    });
    const selectionsRef = React.useRef();
    selectionsRef.current = selections;
    const [statusMessages, setStatusMessages] = React.useState([]);
    const [groups, setGroups] = React.useState([]);
    const applyFileSizeFilter = (filter, itemsList) => {
        return itemsList.filter((item) => item.fileSize.includes(filter.values && filter.values[0]));
    };
    const renderFileSizeFilter = (props) => {
        const { onFilterChange } = props;
        const onTextChange = (e) => {
            const filterData = Object.assign({}, props);
            filterData.values = [''];
            if (e.target.value) {
                filterData.values[0] = e.target.value;
            }
            else {
                filterData.values = [];
            }
            onFilterChange && onFilterChange(filterData);
        };
        return (_jsxs(_Fragment, { children: [_jsx("span", { children: props.label }, void 0), _jsx("input", { name: "fileSize", onChange: onTextChange, value: props.values && props.values[0] }, void 0)] }, void 0));
    };
    const columns = [
        {
            key: 'id',
            name: 'Id',
            fieldName: 'id',
            minWidth: 210,
            maxWidth: 210,
            isRowHeader: true,
            isResizable: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            isPadded: true,
            required: true,
            searchable: true,
            filterType: FilterType.RangeFilter,
            filterDataType: FilterDataType.Number,
            filterOrder: 1,
            disableSort: true
        },
        {
            key: 'column2',
            name: 'Name',
            fieldName: 'name',
            minWidth: 210,
            maxWidth: 210,
            isRowHeader: true,
            isResizable: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            isPadded: true,
            required: true
        },
        {
            key: 'column3',
            name: 'Date Modified',
            fieldName: 'dateModified',
            minWidth: 70,
            maxWidth: 70,
            isResizable: true,
            data: 'number',
            onRender: (item) => {
                return (_jsx(HighlightText, { text: item.dateModified.toDateString(), textToBeHighlighted: selectionsRef.current.searchText }, void 0));
            },
            isPadded: true,
            selected: true,
            searchable: true,
            filterType: FilterType.TimeLineFilter,
            filterDataType: FilterDataType.Date,
            filterOrder: 1
        },
        {
            key: 'column4',
            name: 'File Type',
            fieldName: 'fileType',
            minWidth: 70,
            maxWidth: 70,
            searchable: true,
            isResizable: true,
            isCollapsible: true,
            data: 'string',
            onRender: (item) => _jsx("span", { children: item.fileType }, void 0),
            isPadded: true,
            selected: true,
            filterType: FilterType.SelectionFilter,
            // hideSelectAll: true,
            // filterItems: [{ id: "CSV", label: "CSV"}, { id: "XLS", label: "XLS"}], //pass when server side grid
            grouping: true
            // groupLevel: 0
        },
        {
            key: 'column5',
            name: 'Valid File',
            fieldName: 'isValid',
            minWidth: 70,
            maxWidth: 70,
            isResizable: true,
            isCollapsible: true,
            data: 'number',
            selected: true,
            onRender: (item) => _jsx("span", { children: item.isValid ? 'Yes' : 'No' }, void 0),
            filterType: FilterType.ToggleFilter,
            filterItems: [
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
            ] // pass when server side grid
        },
        {
            key: 'column6',
            name: 'File Size (KB)',
            fieldName: 'fileSize',
            filterType: FilterType.Custom,
            FilterComponent: renderFileSizeFilter,
            applyFilter: applyFileSizeFilter,
            minWidth: 70,
            maxWidth: 70,
            isResizable: true,
            isCollapsible: true,
            data: 'number',
            selected: true,
            grouping: true,
            // groupLevel: 1,
            getGroupName: (groupValue, itemList) => `File Size: ${groupValue} KB`
        }
    ];
    function getDocuments() {
        const documents = [];
        for (let i = 0; i < 100; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            documents.push({
                id: i,
                name: `fileName ${i.toString()}`,
                fileType: i % 2 === 0 ? 'CSV' : 'XLS',
                dateModified: date,
                isValid: i % 2 === 0,
                fileSize: Math.floor(Math.random() * (20 - 10 + 1) + 10).toString()
            });
        }
        return documents;
    }
    const onHandleChange = (selection, changeType) => {
        console.log(selection);
        setSelection(selection);
    };
    const getQuickActionSection = () => (_jsx(_Fragment, { children: _jsx("button", Object.assign({ type: "button" }, { children: "test" }), void 0) }, void 0));
    const onRefresh = () => {
        const randomValue = Math.floor(Math.random() * (100 - 10 + 1) + 10);
        let documents = getDocuments();
        documents = documents.slice(1, randomValue);
        setItems(documents);
    };
    const updateSelection = () => {
        selections.selectedItems.push(items[1]);
        selections.selectedItems = Array.from(selections.selectedItems);
        setSelection(Object.assign({}, selections));
    };
    const onSetErrors = () => {
        const messages = [
            {
                messageType: GridViewMessageType.Success,
                message: 'Success!',
                autoDismiss: true
            },
            {
                messageType: GridViewMessageType.Error,
                message: 'Error'
            },
            {
                messageType: GridViewMessageType.Warning,
                message: 'Warning',
                autoDismiss: true
            },
            {
                messageType: GridViewMessageType.Information,
                message: 'Information',
                autoDismiss: true
            }
        ];
        setStatusMessages(messages);
    };
    const onExport = (options, selection) => {
        console.log(options);
    };
    const onEdit = (item) => {
        console.log(item);
    };
    const onDelete = (itemList) => {
        console.log(itemList);
    };
    // Custom Group Implementation
    function createGroups(itemList) {
        const groupFields = [
            {
                fieldName: 'fileType',
                level: 0
            },
            {
                fieldName: 'fileSize',
                level: 1,
                getGroupName: (groupValue, groupItems) => `File Size: ${groupValue} KB`
            }
        ];
        const groupData = getGridViewGroupsByFields(groupFields, itemList);
        setGroups(groupData.groups);
        setItems(groupData.items);
    }
    const getQuickActionBarItems = () => {
        let items = [
            {
                key: '1',
                type: GridViewActionBarItems.Custom,
                alignment: QucickActionSectionAlignment.Left,
                onRender: () => {
                    return _jsx("button", Object.assign({ type: "button" }, { children: "test" }), void 0);
                }
            },
            {
                key: '2',
                type: GridViewActionBarItems.EditButton,
                alignment: QucickActionSectionAlignment.Left
            },
            {
                key: '3',
                type: GridViewActionBarItems.Custom,
                alignment: QucickActionSectionAlignment.Left,
                label: 'Test',
                icon: 'edit',
                onClick: () => {
                    console.log('Custom Action item onClick');
                }
            }
        ];
        return items;
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", Object.assign({ type: "button", onClick: onSetErrors }, { children: "Set Errors" }), void 0), _jsx("div", Object.assign({ className: "ms-Grid-row" }, { children: _jsx(GridView, { gridViewType: GridViewType.InMemory, columns: columns, items: items, totalRecords: items.length, pagingOptions: selections.pagingOptions, 
                    // pagingOptionsWithoutPage={{ isNextAllowed: true, isPreviousAllowed: true }}
                    sortingOptions: selections.sortingOptions, selectedFilters: selections.selectedFilters, selectedItems: selections.selectedItems, searchText: selections.searchText, 
                    // groupBy="column4"
                    searchPlaceHolderText: "Search By Date", itemUniqueField: "id", statusMessages: statusMessages, 
                    // QuickActionSection={getQuickActionSection()}
                    // actionBarItems={{
                    //   actionBarLeftItems: [GridViewActionBarItems.Custom],
                    //   actionBarRightItems: []
                    // }}
                    quickActionSectionItems: getQuickActionBarItems(), highLightSearchText: true, 
                    // allowSelection={true}
                    // allowGrouping={true}
                    // allowGroupSelection={true}
                    // isLoading={true}
                    // allowMultiLevelSorting={true}
                    // sortLevel={3}
                    // removeSorting={true}
                    // hidePaging={true}
                    // hideFilters={true}
                    // hideQuickSearch={true}
                    // hideQuickSearchButton={true}
                    // hideQuickActionSection={true}
                    // hideColumnPicker={true}
                    // hideGridSummary={true}
                    // hideClearFilters={true}
                    // quickSearchOnEnter={true}
                    // exportOptions={[{ fileType: 'Excel' }, { fileType: 'Json' }]}
                    // quickSearchOnEnter = {true}
                    // selectFirstItemOnLoad={true}
                    // showFiltersAside={true}
                    // showFiltersOnLoad={true}
                    onHandleChange: onHandleChange, onRefresh: onRefresh, 
                    // onExport={onExport}
                    // onEdit={onEdit}
                    // onDelete={onDelete}
                    maxFilterTagLength: 2, checkboxVisibility: 1, selectionMode: 2, actionSectionClass: classes.actionMenu, gridMainClass: classes.gridSection, gridDataClass: classes.gridDataClass }, void 0) }), void 0)] }, void 0));
};
