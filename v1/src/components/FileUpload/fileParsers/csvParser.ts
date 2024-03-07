import Papa from 'papaparse';

//fileContent: fileContent in Binary format
//isHeaderExist: true/false
//columns: ["Name", "Age"]
export const parseCSVFileToJSON = (fileContent: any, isHeaderExist: any, columns: any) => {
  let promise = new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      complete: function (results) {
        return resolve(parseCSVToJSON(results && results.data, isHeaderExist, columns));
      }
    });
  });
  return promise;
};

const parseCSVToJSON = (results: any, headerExist: any, columns: any) => {
  if (headerExist) {
    results && results.shift();
  }
  if (!Array.isArray(results)) {
    return [];
  }
  if (!(columns && columns.length > 0)) {
    return results;
  }

  let jsonData: any[] = [];
  results.forEach((item, ind) => {
    let itemData: any = {};
    columns.forEach((col: any, i: number) => {
      itemData[col] = item[i];
    });
    jsonData.push(itemData);
  });
  return jsonData;
};
