import { SORT_TYPE, applySorting } from '../../';
import { FilterDataType, FilterOperation, GridViewGroupLabelType } from './GridView.models';
export const mergeItems = (itemsData, mergeField) => {
    let filterItems = [];
    if (itemsData.length === 1) {
        return itemsData[0];
    }
    itemsData.forEach((items) => {
        filterItems = filterItems.concat(items);
    });
    filterItems = filterItems.filter((item, index, self) => self.findIndex((t) => t[mergeField] === item[mergeField]) === index);
    return filterItems;
};
export const applyFilterTextByField = (filterText = '', items = [], fieldName) => {
    let itemsToFilter = [...items];
    itemsToFilter = itemsToFilter.filter((item) => { var _a, _b, _c; return (_b = (_a = item[fieldName]) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes((_c = filterText === null || filterText === void 0 ? void 0 : filterText.toString()) === null || _c === void 0 ? void 0 : _c.toLowerCase()); });
    return itemsToFilter;
};
export const isValidDate = (date) => date instanceof Date && !isNaN(date.getTime());
export const compareDates = (date1, date2, filterOperation = FilterOperation.Equal) => {
    const d1 = new Date(date1);
    d1.setHours && d1.setHours(0, 0, 0, 0);
    const d2 = new Date(date2);
    d2.setHours && d2.setHours(0, 0, 0, 0);
    if (filterOperation === FilterOperation.Equal) {
        return (d1.getTime && d1.getTime()) === (d2.getTime && d2.getTime());
    }
    if (filterOperation === FilterOperation.GreaterThanEqual) {
        return (d1.getTime && d1.getTime()) >= (d2.getTime && d2.getTime());
    }
    if (filterOperation === FilterOperation.LessThanEqual) {
        return (d1.getTime && d1.getTime()) <= (d2.getTime && d2.getTime());
    }
    return true;
};
export const compareDateRange = (date, startDate, endDate) => {
    const d1 = new Date(date);
    d1.setHours && d1.setHours(0, 0, 0, 0);
    const d2 = new Date(startDate);
    d2.setHours && d2.setHours(0, 0, 0, 0);
    const d3 = new Date(endDate);
    d2.setHours && d2.setHours(0, 0, 0, 0);
    if (startDate && endDate) {
        return d1.getTime() >= d2.getTime() && d1.getTime() <= d3.getTime();
    }
    if (startDate) {
        return d1.getTime() >= d2.getTime();
    }
    if (endDate) {
        return d1.getTime() <= d3.getTime();
    }
    return true;
};
export const applyFiltersByFieldName = (filterValues = [], itemList = [], fieldName, dataType = FilterDataType.String, filterOperation = FilterOperation.Equal) => {
    let items = itemList;
    if (filterOperation === FilterOperation.Equal) {
        if (dataType === FilterDataType.Date) {
            const filterValue = filterValues.length ? filterValues[0] : undefined;
            items = items.filter((item) => compareDates(item[fieldName], filterValue));
        }
        else {
            items = items.filter((item) => filterValues.includes(item[fieldName]));
        }
    }
    else if (filterOperation === FilterOperation.GreaterThanEqual) {
        const filterValue = filterValues.length ? filterValues[0] : undefined;
        if (dataType === FilterDataType.Date) {
            items = items.filter((item) => compareDates(item[fieldName], filterValue, FilterOperation.GreaterThanEqual));
        }
        else {
            items = items.filter((item) => item[fieldName] >= filterValue);
        }
    }
    else if (filterOperation === FilterOperation.LessThanEqual) {
        const filterValue = filterValues.length ? filterValues[0] : undefined;
        if (dataType === FilterDataType.Date) {
            items = items.filter((item) => compareDates(item[fieldName], filterValue, FilterOperation.LessThanEqual));
        }
        else {
            items = items.filter((item) => item[fieldName] <= filterValue);
        }
    }
    else if (filterOperation === FilterOperation.Between) {
        const filterValueStart = filterValues.length ? filterValues[0] : undefined;
        const filterValueEnd = filterValues.length && filterValues.length > 1 ? filterValues[1] : undefined;
        if (dataType === FilterDataType.Date) {
            items = items.filter((item) => compareDateRange(item[fieldName], filterValueStart, filterValueEnd));
        }
        else {
            items = items.filter((item) => {
                if (filterValueStart && filterValueEnd) {
                    return item[fieldName] >= filterValueStart && item[fieldName] <= filterValueEnd;
                }
                if (filterValueStart) {
                    return item[fieldName] >= filterValueStart;
                }
                if (filterValueEnd) {
                    return item[fieldName] <= filterValueEnd;
                }
            });
        }
    }
    return items;
};
export const getFieldFilterItems = (field, selectedValues, itemList, isItemCountRequired) => {
    const items = itemList || [];
    const filterItems = [];
    items.forEach((item) => {
        if (!filterItems.find((filterItem) => filterItem.value === item[field] &&
            (item[field] !== undefined || item[field] !== null || item[field] !== ''))) {
            const filterItem = {
                label: item[field],
                value: item[field],
                selected: selectedValues.includes(item[field])
            };
            filterItems.push(filterItem);
        }
    });
    if (isItemCountRequired) {
        filterItems.forEach((filterItem) => {
            filterItem.count = items.filter((item) => item[field] === filterItem.value).length;
        });
    }
    return filterItems;
};
const getGridViewGroupName = (groupValue, column, items) => {
    const groupLabelTypeMapper = {
        [GridViewGroupLabelType.GroupValue]: groupValue,
        [GridViewGroupLabelType.GroupValueAndCount]: `${groupValue} (${items.length})`,
        [GridViewGroupLabelType.ColumnNameAndGroupValueAndCount]: `${column.name}: ${groupValue} (${items.length})`
    };
    return groupLabelTypeMapper[GridViewGroupLabelType.GroupValue];
};
const getGroupsByLevel = (groups, level, results = []) => {
    groups &&
        groups.forEach((group) => {
            if (level === group.level) {
                results.push(group);
            }
            getGroupsByLevel(group.children, level, results);
        });
    return results;
};
export const getGridViewGroupsByColumns = (gridColumns, items, groupColumn, allowGroupSelection) => {
    let groupedColumns = [];
    let columns = gridColumns;
    if (groupColumn) {
        columns = [...columns];
        groupedColumns = columns.filter((col) => col.grouping === true && col.key === groupColumn.key);
        // if (groupedColumns.length) {
        //   groupedColumns[0].groupLevel = 0;
        // }
    }
    else {
        groupedColumns = columns.filter((col) => col.grouping === true && col.groupLevel >= 0);
        if (!groupedColumns.length && !allowGroupSelection) {
            const groupCols = columns.filter((col) => col.grouping === true);
            groupedColumns = groupCols.length ? [groupCols[0]] : [];
        }
    }
    groupedColumns = applySorting(groupedColumns, 'groupLevel', SORT_TYPE.ASC);
    if (!groupedColumns.length) {
        return {
            items,
            groups: undefined
        };
    }
    let groupData = {
        groups: [],
        items: []
    };
    groupedColumns &&
        groupedColumns.forEach((column) => {
            if (column.groupLevel > 0) {
                const groups = getGroupsByLevel(groupData.groups, column.groupLevel - 1);
                groupData.items = groups.length
                    ? updateParentGroups(column.fieldName, column.groupLevel, groups, column.getGroupName)
                    : groupData.items;
            }
            else {
                groupData = getRootGroupsByColumn(column.fieldName, column.groupLevel, items, column.getGroupName);
            }
        });
    return groupData;
};
export const getGridViewGroupsByFields = (fields, items) => {
    const sortedFields = applySorting(fields, 'level', SORT_TYPE.ASC);
    if (!sortedFields.length) {
        return {
            items,
            groups: undefined
        };
    }
    let groupData = {
        groups: [],
        items: []
    };
    sortedFields &&
        sortedFields.forEach((field) => {
            if (field.level > 0) {
                const groups = getGroupsByLevel(groupData.groups, field.level - 1);
                groupData.items = groups.length
                    ? updateParentGroups(field.fieldName, field.level, groups, field.getGroupName)
                    : groupData.items;
            }
            else {
                groupData = getRootGroupsByColumn(field.fieldName, field.level, items, field.getGroupName);
            }
        });
    return groupData;
};
const getRootGroupsByColumn = (fieldName, groupLevel, items, getGroupName) => {
    const groups = [];
    let groupedItems = [];
    const groupData = getGroupData(fieldName, items);
    let count = 0;
    groupData.forEach((groupItem) => {
        const group = getGroup(groupItem, groupLevel, count, getGroupName);
        count += groupItem.items.length;
        groups.push(group);
        groupedItems = groupedItems.concat(groupItem.items);
    });
    return {
        groups: groups.length > 0 ? groups : undefined,
        items: groupedItems
    };
};
const updateParentGroups = (fieldName, groupLevel, parentGroups, getGroupName) => {
    let groupedItems = [];
    parentGroups &&
        parentGroups.forEach((parent) => {
            parent.children = parent.children || [];
            const groupData = getGroupData(fieldName, parent.data);
            let count = parent.startIndex;
            groupData.forEach((groupItem) => {
                var _a;
                const group = getGroup(groupItem, groupLevel, count, getGroupName);
                count += groupItem.items.length;
                (_a = parent.children) === null || _a === void 0 ? void 0 : _a.push(group);
                groupedItems = groupedItems.concat(groupItem.items);
            });
        });
    return groupedItems;
};
const getGroup = (groupItem, groupLevel, count, getGroupName) => {
    const group = {
        key: groupItem.groupName,
        name: getGroupName ? getGroupName(groupItem.groupName, groupItem.items) : groupItem.groupName,
        startIndex: count,
        count: groupItem.items.length,
        data: groupItem.items,
        level: groupLevel
    };
    return group;
};
const getGroupByField = (groupItem, column, count) => {
    const group = {
        key: groupItem.groupName,
        name: column.getGroupName
            ? column.getGroupName(groupItem.groupName, groupItem.items)
            : groupItem.groupName,
        startIndex: count,
        count: groupItem.items.length,
        data: groupItem.items,
        level: column.groupLevel
    };
    return group;
};
export const getGroupData = (groupFieldName, items = []) => {
    const groupValues = Array.from(new Set(items.map((item) => item[groupFieldName])));
    const groups = [];
    groupValues.forEach((grp) => {
        const grpItems = items.filter((item) => item[groupFieldName] === grp);
        if (grpItems.length) {
            groups.push({
                groupName: grp,
                items: grpItems
            });
        }
    });
    return groups;
};
export const getFormattedValue = (value) => {
    if (isValidDate(value)) {
        return new Date(value).toDateString();
    }
    return value;
};
