import { DEFAULT_PAGE_SIZE } from '../constants';
export const applyPaging = (pageSize = DEFAULT_PAGE_SIZE, pageNumber = 1, items) => {
    let itemsForPaging = [...items];
    if (!itemsForPaging)
        return itemsForPaging;
    let size = pageSize;
    if (size > itemsForPaging.length) {
        size = itemsForPaging.length;
    }
    itemsForPaging = itemsForPaging.splice((pageNumber - 1) * size, size);
    return itemsForPaging;
};
export const applyFilterText = (items, fieldName, value) => {
    let itemsToFilter = [...items];
    itemsToFilter = itemsToFilter.filter((item) => { var _a, _b, _c; return (_b = (_a = item[fieldName]) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes((_c = value === null || value === void 0 ? void 0 : value.toString()) === null || _c === void 0 ? void 0 : _c.toLowerCase()); });
    return itemsToFilter;
};
export const applyFilters = (filters = [], items, fieldName) => {
    let itemsToFilter = [...items];
    itemsToFilter = itemsToFilter.filter((item) => filters === null || filters === void 0 ? void 0 : filters.includes(item[fieldName]));
    return itemsToFilter;
};
export const applySorting = (items, sortColumn, sortType) => {
    let itemsToSort = [...(items || [])];
    if (sortColumn !== null) {
        itemsToSort = itemsToSort.sort((a, b) => sortValues(a[sortColumn], b[sortColumn], sortType));
    }
    return itemsToSort;
};
export const sortValues = (val1, val2, sortType) => {
    let value1 = val1 || '';
    let value2 = val2 || '';
    const regex = /^[+-]?\d+(\.\d+)?$/;
    if (value1 && value1.replace && value1.replace(/,/g, '').match(regex)) {
        value1 = parseFloat(value1.replace(/,/g, ''));
    }
    if (value2 && value2.replace && value2.replace(/,/g, '').match(regex)) {
        value2 = parseFloat(value2.replace(/,/g, ''));
    }
    if (sortType === 'asc') {
        if (value1 < value2) {
            return -1;
        }
        if (value1 > value2) {
            return 1;
        }
        return 0;
    }
    if (value1 < value2) {
        return 1;
    }
    if (value1 > value2) {
        return -1;
    }
    return 0;
};
