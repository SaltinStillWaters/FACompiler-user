const RENEWAL_KEYS = ['course_id', 'target_sheet_id'];

(async () => {
try {
    const local_data = await chrome.storage.local.get(RENEWAL_KEYS)
    
    if (local_data['course_id'] === UrlInfo.courseId) {
        console.log('local_data is up to date');
        SheetInfo.overwriteTargetID(local_data['target_sheet_id']);
    } else {
        console.log('needs update');
        await updateLocalData();
    }

    console.log('target id: ', SheetInfo.targetID);

    await Canvas.extractChoices();
    await Canvas.extractQuestion();
    await Canvas.extractFANumber();
    await Sheet.createSheet(SheetInfo.targetID, Canvas.fa_number);
    //insert question
    await findQuestion(SheetInfo.targetID, Canvas.fa_number, UrlInfo.questionId);
} catch (error) {
    console.error(error);    
}
})();
    

async function updateLocalData(): Promise<void> {
    let dict: { [key: string]: string } = {};

    await SheetInfo.extractTargetID();
    const vals: string[] = [UrlInfo.courseId, SheetInfo.targetID];

    RENEWAL_KEYS.forEach((key, index) => {
        dict[key] = vals[index];
    });

    await chrome.storage.local.set(dict);
}

async function findQuestion(spreadsheet_id: any, sheet_name: any, question_id: any) {
    console.log('finding question');
    let result = await SheetAPI.read(spreadsheet_id, sheet_name, SubSheetInfo.COLUMNS.total);
    let row_count = result[0][0];
    // console.log('row_count: ', row_count);
    let range = computeRange(SubSheetInfo.BACKEND_COLUMNS.question_id, row_count);
    // console.log('range: ', range);
    let table = await SheetAPI.read(spreadsheet_id, sheet_name, range);
    // console.log('table: ', table);
    
    let index = binarySearch(table, UrlInfo.questionId);
    if (!index.isFound) {
        console.log('question not found');
        if (UrlInfo.questionId > table[index.index][0])
            ++index.index;
        
        //insert row
        await SheetAPI.insertRow(spreadsheet_id, sheet_name, index.index + 1, Canvas.buildFrontendValues());

        let range = computeRange(SubSheetInfo.BACKEND_COLUMNS.question_id, 1, SubSheetInfo.BACKEND_COLUMNS.wrong_answer, index.index + 1);
        console.log('range: ', range);
        console.log('backend values: ', [Canvas.buildBackendValues()])
        await SheetAPI.write(spreadsheet_id, sheet_name, range, [Canvas.buildBackendValues()]);
        console.log('done inserting');
    }
}

async function insertQuestion() {

}












// chrome.storage.local.get(UrlInfo.KEYS)
//     .then(local_data => {
//         if (local_data['url'] === UrlInfo.url) {
//             console.log('updated');
//             URL
//             return;
//         }
        
//         console.log('needs update')
//         UrlInfo.update();
//         return updateLocalData();
//     })
//     .then(() => {
//         //some code
//     })
//     .catch((error) => {
//         //some code
//     })
    
// async function updateLocalData(): Promise<void> {
//     let dict: { [key: string]: string } = {};
//     const vals: string[] = UrlInfo.getValsAsArray();

//     UrlInfo.KEYS.forEach((key, index) => {
//         dict[key] = vals[index];
//     });

//     await chrome.storage.local.set(dict);
// }