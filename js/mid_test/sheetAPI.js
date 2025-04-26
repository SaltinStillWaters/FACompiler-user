"use strict";
class SheetAPI {
    static updateColSize(spreadsheetID, sheetName, colIndexWidths) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'updateColSize',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName,
                colIndexWidths: colIndexWidths
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
    static create(spreadsheetID, sheetName) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'createSheet',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
    static createSpreadSheet(title, folder_id) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'createSpreadSheet',
                title: title,
                folder_id: folder_id
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
    static insertRow(spreadsheetID, sheetName, rowIndex, rowData) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'insertRowToSheet',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName,
                rowIndex: rowIndex,
                rowData: rowData
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
    static read(spreadsheetID, sheetName, range) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'readFromSheet',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName,
                range: range
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
    static write(spreadsheetID, sheetName, range, values) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'writeToSheet',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName,
                range: range,
                values: values
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
    static writeFormula(spreadsheetID, sheetName, range, values) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'writeFormulaToSheet',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName,
                range: range,
                values: values
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.result);
                }
            });
        });
    }
    static checkIfExists(spreadsheetID, sheetName) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'checkSheetExists',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName
            }, (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                }
                else {
                    resolve(response.exists);
                }
            });
        });
    }
}
//# sourceMappingURL=sheetAPI.js.map