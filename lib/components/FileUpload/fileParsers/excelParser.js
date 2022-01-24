import * as XLSX from 'xlsx';
import Papa from 'papaparse';
//fileContent: fileContent in Binary format
//columns: [{"Name1": "Name"}, {"Age": "Age"}]
//isMultiSheet: true/false
//trimWhitespace: true/false
//parseRawValues:true/false
export const parseExcelFileToJSON = (fileContent, columns = [], isMultiSheet = false, trimWhitespace = false, isColumnNameCheck = false, parseRawValues = false) => {
    let promise = new Promise((resolve, reject) => {
        let workbook = XLSX.read(fileContent, { type: 'binary' });
        if (isMultiSheet) {
            let excelData = {};
            workbook.SheetNames.forEach((sheetName, index) => {
                var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                excelData[index] = sheetData;
            });
            return resolve(excelData);
        }
        else {
            if (workbook.SheetNames.length === 0) {
                return resolve([]);
            }
            var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
                raw: parseRawValues,
                defval: ''
            });
            return resolve(parseExcelToJSON(sheetData, columns, trimWhitespace, isColumnNameCheck));
        }
    });
    return promise;
};
//fileContent: fileContent in Binary format
//columns: ["Name", "Age", "Gender"]
//isMultiSheet: true/false
//hasColumnHeader: true/false
export const parseExcelFileToJSONUsingColumnOrder = (fileContent, columns = [], isMultiSheet = false, hasColumnHeader = true) => {
    let promise = new Promise((resolve, reject) => {
        let workbook = XLSX.read(fileContent, { type: 'binary' });
        if (isMultiSheet) {
            let excelData = {};
            workbook.SheetNames.forEach((sheetName, index) => {
                let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                let result = Papa.parse(csv);
                result = result && result.data ? result.data : [];
                if (hasColumnHeader && result && result.length && result.length > 0) {
                    result.splice(0, 1);
                }
                excelData[index] = result;
            });
            return resolve(excelData);
        }
        else {
            if (workbook.SheetNames.length === 0) {
                return resolve([]);
            }
            let csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
            let result = Papa.parse(csv);
            result = result && result.data ? result.data : [];
            if (hasColumnHeader && result && result.length && result.length > 0) {
                result.splice(0, 1);
            }
            return resolve(parseArrayContentToJSON(result, columns));
        }
    });
    return promise;
};
const parseArrayContentToJSON = (results, columns) => {
    if (!Array.isArray(results)) {
        return [];
    }
    if (results.length === 0) {
        return [];
    }
    if (!(columns && columns.length > 0)) {
        return results;
    }
    let jsonData = [];
    results.forEach((row) => {
        let data = {};
        row.forEach((col, index) => {
            if (index < columns.length) {
                data[columns[index]] = col;
            }
        });
        jsonData.push(data);
    });
    return jsonData;
};
const parseExcelToJSON = (results, columns, trimWhitespace, isColumnNameCheck) => {
    if (!Array.isArray(results)) {
        return [];
    }
    if (results.length === 0) {
        return [];
    }
    if (!(columns && columns.length > 0)) {
        return results;
    }
    if (isColumnNameCheck) {
        let missingColumns = [], addiontionalColumns = [];
        let items = Object.keys(results[0]);
        let itemKeys = [];
        items.forEach((item) => {
            itemKeys.push(item.trim());
        });
        columns.forEach((col) => {
            let colKey = Object.keys(col)[0];
            let colIndex = itemKeys.indexOf(col[colKey]);
            if (colIndex < 0) {
                missingColumns.push(col[colKey]);
            }
            else {
                itemKeys.splice(colIndex, 1);
            }
        });
        addiontionalColumns = itemKeys;
        if (missingColumns.length > 0 || addiontionalColumns.length > 0) {
            return {
                missingColumns: missingColumns,
                addiontionalColumns: addiontionalColumns
            };
        }
    }
    let jsonData = [];
    results.forEach((item, ind) => {
        if (trimWhitespace) {
            Object.keys(item).forEach(function (objItem) {
                item[objItem.trim()] =
                    item[objItem] && typeof item[objItem] === 'string' ? item[objItem].trim() : item[objItem];
            });
        }
        let itemData = {};
        columns.forEach((col) => {
            let colKey = Object.keys(col)[0];
            itemData[colKey] = item[col[colKey]];
        });
        jsonData.push(itemData);
    });
    return jsonData;
};
