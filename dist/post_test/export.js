"use strict";
class Export {
    static async getSubmissions(courseId, fa_id, baseUrl) {
        const quizUrl = `${baseUrl}api/v1/courses/${courseId}/quizzes/${fa_id}/`;
        const submissionsURL = quizUrl + 'submissions';
        const [resQuiz, resSubmissions] = await Promise.all([fetch(quizUrl), fetch(submissionsURL)]);
        const [rawQuiz, rawSubmissions] = await Promise.all([resQuiz.text(), resSubmissions.text()]);
        const [quiz, submissions] = [JSON.parse(rawQuiz), JSON.parse(rawSubmissions).quiz_submissions];
        const assignmentId = quiz.assignment_id;
        const userId = submissions.at(-1).user_id;
        if (!assignmentId) {
            throw new Error('Unable to retrieve assignmentId');
        }
        else if (!userId) {
            throw new Error('Unable to retrieve userId');
        }
        const submissionsHistoryUrl = `${baseUrl}api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}?include[]=submission_history`;
        return await fetch(submissionsHistoryUrl).then(res => res.text()).then(res => JSON.parse(res).submission_history);
    }
    static async processSubmissions() {
        showToast('Extracting data...', '#bfc2bf', 5000);
        const submissions = await this.getSubmissions(UrlInfo_POST.courseId, UrlInfo_POST.FAId, UrlInfo_POST.baseUrl);
        showToast('Done extracting', '#7af599', 5000);
        const element = document.getElementById("quiz_title");
        let fa_number = '';
        if (element) {
            fa_number = element.innerText;
            fa_number = sanitizeForURL_POST(fa_number);
        }
        else {
            console.log('no fa number');
        }
        let count = await SheetAPI_POST.read(SheetInfo_POST.targetID, fa_number, SubSheetInfo_POST.COLUMNS.total);
        const row_count = count[0][0];
        const range = computeRange_POST(SubSheetInfo_POST.BACKEND_COLUMNS.question_id, row_count, SubSheetInfo_POST.BACKEND_COLUMNS.wrong_answer);
        const table = await SheetAPI_POST.read(SheetInfo_POST.targetID, fa_number, range);
        let api_input = [];
        for (const submission of submissions) {
            for (const data of submission.submission_data) {
                if (!data.answer_id) {
                    continue;
                }
                let wrong_answer = '';
                let correct_answer = '';
                if (data.correct) {
                    correct_answer = data.answer_id;
                }
                else {
                    wrong_answer = data.answer_id;
                }
                let index = binarySearch_POST(table, data.question_id);
                if (index.isFound) {
                    if (table[index.index][4]) {
                        continue;
                    }
                    if (table[index.index][3]) {
                        wrong_answer = table[index.index][3] + '**EOF**' + wrong_answer;
                    }
                    let range = 'Y' + (index.index + 2) + ':Z' + (index.index + 2);
                    api_input.push({
                        range: range,
                        vals: [[correct_answer, wrong_answer]]
                    });
                }
            }
        }
        console.log(api_input);
        showToast('Updating sheets...', '#bfc2bf', 5000);
        await SheetAPI_POST.writeVals(SheetInfo_POST.targetID, fa_number, api_input);
        showToast('Finished exporting!!', '#7af599', 10000);
        return;
    }
    static columnToLetter(colIndex) {
        let letter = "";
        while (colIndex > 0) {
            let remainder = (colIndex - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            colIndex = Math.floor((colIndex - 1) / 26);
        }
        return letter;
    }
}
//# sourceMappingURL=export.js.map