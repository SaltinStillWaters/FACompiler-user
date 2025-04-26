class SheetAPI {
    static updateColSize(spreadsheetID: any, sheetName: any, colIndexWidths: any) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'updateColSize',
                spreadsheetID: spreadsheetID,
                sheetName: sheetName,
                colIndexWidths: colIndexWidths
            },
            (response) => {
                if (response.error) {
                    console.error(response.error);
                    reject(response.error);
                } else {
                    resolve(response.result);
                }
            }
        )
        })
    }

    static create(spreadsheetID: any, sheetName: any): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    action: 'createSheet',
                    spreadsheetID: spreadsheetID,
                    sheetName: sheetName
                },
                (response: any) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(response.error);
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    }

    static createSpreadSheet(title: any, folder_id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    action: 'createSpreadSheet',
                    title: title,
                    folder_id: folder_id
                },
                (response: any) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(response.error);
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    }

    static insertRow(spreadsheetID: any, sheetName: any, rowIndex: any, rowData: any): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    action: 'insertRowToSheet',
                    spreadsheetID: spreadsheetID,
                    sheetName: sheetName,
                    rowIndex: rowIndex,
                    rowData: rowData
                },
                (response: any) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(response.error);
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    }

    static read(spreadsheetID: any, sheetName: any, range: any): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    action: 'readFromSheet',
                    spreadsheetID: spreadsheetID,
                    sheetName: sheetName,
                    range: range
                },
                (response: any) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(response.error);
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    }

    static write(spreadsheetID: any, sheetName: any, range: any, values: any): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    action: 'writeToSheet',
                    spreadsheetID: spreadsheetID,
                    sheetName: sheetName,
                    range: range,
                    values: values
                },
                (response: any) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(response.error);
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    
    }

    static writeFormula(spreadsheetID: any, sheetName: any, range: any, values: any): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    action: 'writeFormulaToSheet',
                    spreadsheetID: spreadsheetID,
                    sheetName: sheetName,
                    range: range,
                    values: values
                },
                (response: any) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(response.error);
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    }

    static checkIfExists(spreadsheetID: any, sheetName: any): Promise<any> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {
                    action: 'checkSheetExists',
                    spreadsheetID: spreadsheetID,
                    sheetName: sheetName
                },
                (response: any) => {
                    if (response.error) {
                        console.error(response.error);
                        reject(response.error);
                    } else {
                        resolve(response.exists);
                    }
                }
            );
        });
    }
}
