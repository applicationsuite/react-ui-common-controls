import { DEFAULT_PAGE_SIZE } from '../constants';

export const applyPaging = (
  pageSize: number = DEFAULT_PAGE_SIZE,
  pageNumber: number = 1,
  items: any[]
) => {
  let itemsForPaging = [...items];
  if (!itemsForPaging) return itemsForPaging;
  let size = pageSize;
  if (size > itemsForPaging.length) {
    size = itemsForPaging.length;
  }
  itemsForPaging = itemsForPaging.splice((pageNumber - 1) * size, size);
  return itemsForPaging;
};

export const applyFilterText = (items: any[], fieldName: string, value?: string) => {
  let itemsToFilter = [...items];
  itemsToFilter = itemsToFilter.filter((item) =>
    item[fieldName]?.toString()?.toLowerCase().includes(value?.toString()?.toLowerCase())
  );
  return itemsToFilter;
};

export const applyFilters = (filters: any[] = [], items: any[], fieldName: string) => {
  let itemsToFilter = [...items];
  itemsToFilter = itemsToFilter.filter((item) => filters?.includes(item[fieldName]));
  return itemsToFilter;
};

export const applySorting = (items: any[], sortColumn: string, sortType: string) => {
  let itemsToSort = [...(items || [])];
  if (sortColumn !== null) {
    itemsToSort = itemsToSort.sort((a, b) => sortValues(a[sortColumn], b[sortColumn], sortType));
  }
  return itemsToSort;
};

export const sortValues = (val1: any, val2: any, sortType: string) => {
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
