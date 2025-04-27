const RENEWAL_KEYS = ['course_id', 'target_sheet_id', 'fa_id'];

(async () => {
try {
    const local_data = await chrome.storage.local.get(RENEWAL_KEYS)
    
    //need this at top to check if FA is actually an SA
    Canvas.extractFANumber();
    
    if (local_data['course_id'] === UrlInfo.courseId && local_data['fa_id'] === UrlInfo.FAId) {
        SheetInfo.overwriteTargetID(local_data['target_sheet_id']);
    } else {
        if (checkIfSA()) {
            return
        }

        await updateLocalData();
    }
    
    Canvas.extractChoices();
    Canvas.extractQuestion();
    await Sheet.createSheet(SheetInfo.targetID, Canvas.fa_number);

    await findQuestion(SheetInfo.targetID, Canvas.fa_number, UrlInfo.questionId);
} catch (error) {
    showToast("Error. Pls try again") 
}
})();
    
function checkIfSA(): boolean {
    const invalids = ['sa', 'summative', 's([^a-zA-Z])\\d', 's\\d', 'midterm', 'me', 'final', 'fe'];
    const regex = new RegExp(invalids.join('|'))

    return regex.test(Canvas.fa_number.toLowerCase())
}

async function updateLocalData(): Promise<void> {
    let dict: { [key: string]: string } = {};

    await SheetInfo.extractTargetID();
    const vals: string[] = [UrlInfo.courseId, SheetInfo.targetID, UrlInfo.FAId];

    RENEWAL_KEYS.forEach((key, index) => {
        dict[key] = vals[index];
    });

    await chrome.storage.local.set(dict);
}

async function findQuestion(spreadsheet_id: any, sheet_name: any, question_id: any) {
    let result = await SheetAPI.read(spreadsheet_id, sheet_name, SubSheetInfo.COLUMNS.total);
    let row_count = result[0][0];
    let range = computeRange(SubSheetInfo.BACKEND_COLUMNS.question_id, row_count);
    let table = await SheetAPI.read(spreadsheet_id, sheet_name, range);
    
    let index = binarySearch(table, question_id);
    if (!index.isFound) {
        if (UrlInfo.questionId > table[index.index][0])
            ++index.index;
        
        let row = index.index + 1
        await SheetAPI.insertRow(spreadsheet_id, sheet_name, row, Canvas.buildFrontendValues());

        row++;
        
        const ans_formula = SubSheetInfo.answer_formula[0][0].replaceAll('_', row.toString());
        
        await SheetAPI.writeFormula(spreadsheet_id, sheet_name, SubSheetInfo.COLUMNS.answer + row, [[ans_formula]])

        const wrong_ans_formula = SubSheetInfo.wrong_answer_formula[0][0].replaceAll('_', row.toString());
        await SheetAPI.writeFormula(spreadsheet_id, sheet_name, SubSheetInfo.COLUMNS.wrong_answer + row, [[wrong_ans_formula]])

        let range = computeRange(SubSheetInfo.BACKEND_COLUMNS.question_id, 1, SubSheetInfo.BACKEND_COLUMNS.wrong_answer, row - 1);
        await SheetAPI.write(spreadsheet_id, sheet_name, range, [Canvas.buildBackendValues()]);
    }
    showToast('Done!', '#7af599')
}