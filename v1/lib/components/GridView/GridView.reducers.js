import { GRIDVIEW_ACTIONS } from './GridView.actions';
export const gridViewReducer = (state, action) => {
    switch (action.type) {
        case GRIDVIEW_ACTIONS.INITIALIZE: {
            const initialData = action.data;
            return Object.assign(Object.assign({}, state), initialData);
        }
        case GRIDVIEW_ACTIONS.SET_ITEMS: {
            return Object.assign(Object.assign({}, state), { items: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_COLUMNS: {
            return Object.assign(Object.assign({}, state), { columns: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_SEARCH_TEXT: {
            return Object.assign(Object.assign({}, state), { searchText: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_FILTER_ITEMS: {
            return Object.assign(Object.assign({}, state), { filteredItems: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_PAGING_OPTIONS: {
            return Object.assign(Object.assign({}, state), { pagingOptions: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS: {
            return Object.assign(Object.assign({}, state), { paginatedFilteredItems: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_SORT_OPTIONS: {
            return Object.assign(Object.assign({}, state), { sortingOptions: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_SELECTED_ITEMS: {
            return Object.assign(Object.assign({}, state), { selectedItems: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_FILTERS: {
            return Object.assign(Object.assign({}, state), { filters: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_SELECTED_FILTERS: {
            return Object.assign(Object.assign({}, state), { selectedFilters: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_GROUPS: {
            return Object.assign(Object.assign({}, state), { groups: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_GROUP_COLUMN: {
            return Object.assign(Object.assign({}, state), { groupColumn: action.data });
        }
        case GRIDVIEW_ACTIONS.SET_DATA: {
            return Object.assign(Object.assign({}, state), action.data);
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
