"use strict";
const RENEWAL_KEYS = ['course_id', 'target_sheet_id', 'fa_id'];
(async () => {
    try {
        const local_data = await chrome.storage.local.get(RENEWAL_KEYS);
        if (local_data['course_id'] === UrlInfo.courseId && local_data['fa_id'] === UrlInfo.FAId) {
            SheetInfo.overwriteTargetID(local_data['target_sheet_id']);
            console.log('local_data is up to date');
        }
        else {
            console.log('needs update');
            await updateLocalData();
        }
        console.log('target id: ', SheetInfo.targetID);
        Canvas.extractChoices();
        Canvas.extractQuestion();
        Canvas.extractFANumber();
        await Sheet.createSheet(SheetInfo.targetID, Canvas.fa_number);
        await findQuestion(SheetInfo.targetID, Canvas.fa_number, UrlInfo.questionId);
    }
    catch (error) {
        console.error(error);
    }
})();
async function updateLocalData() {
    let dict = {};
    await SheetInfo.extractTargetID();
    const vals = [UrlInfo.courseId, SheetInfo.targetID, UrlInfo.FAId];
    RENEWAL_KEYS.forEach((key, index) => {
        dict[key] = vals[index];
    });
    await chrome.storage.local.set(dict);
}
async function findQuestion(spreadsheet_id, sheet_name, question_id) {
    console.log('finding question:');
    let result = await SheetAPI.read(spreadsheet_id, sheet_name, SubSheetInfo.COLUMNS.total);
    console.log(result);
    let row_count = result[0][0];
    console.log('row_count: ', row_count);
    let range = computeRange(SubSheetInfo.BACKEND_COLUMNS.question_id, row_count);
    console.log('range: ', range);
    let table = await SheetAPI.read(spreadsheet_id, sheet_name, range);
    console.log('table: ', table);
    let index = binarySearch(table, question_id);
    if (!index.isFound) {
        console.log('question not found');
        if (UrlInfo.questionId > table[index.index][0])
            ++index.index;
        await SheetAPI.insertRow(spreadsheet_id, sheet_name, index.index + 1, Canvas.buildFrontendValues());
        let range = computeRange(SubSheetInfo.BACKEND_COLUMNS.question_id, 1, SubSheetInfo.BACKEND_COLUMNS.wrong_answer, index.index + 1);
        console.log('range: ', range);
        console.log('backend values: ', [Canvas.buildBackendValues()]);
        await SheetAPI.write(spreadsheet_id, sheet_name, range, [Canvas.buildBackendValues()]);
        console.log('done inserting');
    }
}
//# sourceMappingURL=init.js.map