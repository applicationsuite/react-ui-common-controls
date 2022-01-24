import Papa from 'papaparse';
//fileContent: fileContent in Binary format
//isHeaderExist: true/false
//columns: ["Name", "Age"]
export const parseCSVFileToJSON = (fileContent, isHeaderExist, columns) => {
    let promise = new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            complete: function (results) {
                return resolve(parseCSVToJSON(results && results.data, isHeaderExist, columns));
            }
        });
    });
    return promise;
};
const parseCSVToJSON = (results, headerExist, columns) => {
    if (headerExist) {
        results && results.shift();
    }
    if (!Array.isArray(results)) {
        return [];
    }
    if (!(columns && columns.length > 0)) {
        return results;
    }
    let jsonData = [];
    results.forEach((item, ind) => {
        let itemData = {};
        columns.forEach((col, i) => {
            itemData[col] = item[i];
        });
        jsonData.push(itemData);
    });
    return jsonData;
};
