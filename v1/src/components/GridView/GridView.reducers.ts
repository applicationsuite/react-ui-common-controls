import { GRIDVIEW_ACTIONS } from './GridView.actions';
import { IGridViewData } from './GridView.models';

export const gridViewReducer = (state: any, action: any) => {
  switch (action.type) {
    case GRIDVIEW_ACTIONS.INITIALIZE: {
      const initialData: IGridViewData = action.data;
      return { ...state, ...initialData };
    }
    case GRIDVIEW_ACTIONS.SET_ITEMS: {
      return { ...state, items: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_COLUMNS: {
      return { ...state, columns: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_SEARCH_TEXT: {
      return { ...state, searchText: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_FILTER_ITEMS: {
      return { ...state, filteredItems: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_PAGING_OPTIONS: {
      return { ...state, pagingOptions: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS: {
      return { ...state, paginatedFilteredItems: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_SORT_OPTIONS: {
      return { ...state, sortingOptions: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_SELECTED_ITEMS: {
      return { ...state, selectedItems: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_FILTERS: {
      return { ...state, filters: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_SELECTED_FILTERS: {
      return { ...state, selectedFilters: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_GROUPS: {
      return { ...state, groups: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_GROUP_COLUMN: {
      return { ...state, groupColumn: action.data };
    }
    case GRIDVIEW_ACTIONS.SET_DATA: {
      return { ...state, ...action.data };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
