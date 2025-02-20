const initSheetPromise = chrome.storage.local.get(G_KEYS)
    .then(localData => {
    
        if (localData['currURL'] === Extract.cleanedURL()) {

            return G_URL_INFO = localData;
        }
        showToast("FACompiler is enabled. Disable it if this is an SA!");


        G_URL_INFO = Extract.URLInfo();
        return chrome.storage.local.set(G_URL_INFO);
    })
    .then(() => {



        return Sheet.read(SPREADSHEET_ID, G_INFO_SHEET.name, G_INFO_SHEET.rowCountCell)
            .then(result => {

                return Number(result[0][0]);
            })
    })
    .then(rowCount => {
        let info =
        {
            createSheet: true,
            indexToInsert: null,
            rowCount: rowCount,
            range: null,
        };

        if (rowCount === 0) {
            info.indexToInsert = 1;
        }

        return info;
    })
    .then(info => {
        if (info.rowCount === 0) {
            return info;
        }

        range = Utils.computeRange(G_INFO_SHEET.tableColumn, G_ROW_START, info.rowCount);

        return Sheet.read(SPREADSHEET_ID, G_INFO_SHEET.name, range)
            .then(result => {

                result = result.map(row =>
                    row.map(val => {
                        num = parseInt(val);
                        return isNaN(num) ? val : num;
                    })
                );


                info.table = result;
                return info;
            });
    })
    .then(info => {
        if (info.rowCount === 0) {
            return info;
        }

        const key = Number(G_URL_INFO['FAID']);
        let index = binarySearch(info.table, key).index;


        if (info.table[index][0] === key) {
            info.createSheet = false;
            info.indexFound = index;
        }
        else if (key > info.table[index][0]) {
            index++;
        }

        info.indexToInsert = index + G_ROW_START;
        return info;
    })
    .then(info => {
        if (info.createSheet) {
            return Sheet.create(SPREADSHEET_ID, G_URL_INFO["FANumber"])
                .then(newSheet => {
                    if (newSheet) {

                        return initSheet(SPREADSHEET_ID, G_URL_INFO['FANumber']);
                    }
                    else {
                        return Promise.reject('Failed to create new Sheet: ' + G_URL_INFO['FANumber']);
                    }
                })
                .then(initResponse => {
                    if (initResponse) {

                        return Sheet.insertRow(SPREADSHEET_ID, G_INFO_SHEET.name, info.indexToInsert, [G_URL_INFO['FAID'], G_URL_INFO['FANumber']])
                            .then(() => {
                                return Sheet.write(SPREADSHEET_ID, G_INFO_SHEET.name, G_INFO_SHEET.rowCountCell, [[info.rowCount + 1]]);
                            });
                    }
                    else {
                        return Promise.reject("Sheet: " + G_URL_INFO['FANumber'] + ' not initialized');
                    }
                })
        }
        else //if not create sheet 
        {
            range = Utils.computeRange(G_INFO_SHEET.nameColumn, G_ROW_START + info.indexFound, 1);
            console.log("column: ", G_INFO_SHEET.nameColumn);
            console.log("found entry at range: ", range);
    
            return Sheet.read(SPREADSHEET_ID, G_INFO_SHEET.name, range)
            .then(result =>
            {
                console.log('Extracting table from Info Sheet...');
                result = result.map(row =>
                    row.map(val =>
                        {
                            num = parseInt(val);
                            return isNaN(num) ? val : num;
                        })
                    );
                    
                console.log("Name:", result[0][0]);
                G_URL_INFO["FANumber"] = result[0][0];
                return info;
            });
        }
    })
    .catch((error) => {

        throw error;
    });

function initSheet(spreadsheetID, sheetName) {
    return Sheet.write(spreadsheetID, sheetName, 'A1:I1', [['QUESTION', 'CHOICES', 'ANSWER', 'WRONG ANSWERS', 'BACKEND CHOICES', 'BACKEND ANSWER', 'BACKEND WRONGS', 'TOTAL QUESTIONS', 0]]);
}