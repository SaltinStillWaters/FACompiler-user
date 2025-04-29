class Export {
    static async getSubmissions(courseId: any, fa_id: any, baseUrl: any) {
        const quizUrl = `${baseUrl}api/v1/courses/${courseId}/quizzes/${fa_id}/`;
        const submissionsURL = quizUrl + 'submissions';

        const [resQuiz, resSubmissions] = await Promise.all([fetch(quizUrl), fetch(submissionsURL)])
        const [rawQuiz, rawSubmissions] = await Promise.all([resQuiz.text(), resSubmissions.text()])
        const [quiz, submissions] = [JSON.parse(rawQuiz), JSON.parse(rawSubmissions).quiz_submissions]

        const assignmentId = quiz.assignment_id;
        const userId = submissions.at(-1).user_id;
        
        if (!assignmentId) {
            throw new Error('Unable to retrieve assignmentId');
        } else if (!userId) {
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
        } else {
            console.log('no fa number');
        }
        
        let count = await SheetAPI_POST.read(SheetInfo_POST.targetID, fa_number, SubSheetInfo_POST.COLUMNS.total);
        const row_count = count[0][0];

        const range = computeRange_POST(SubSheetInfo_POST.BACKEND_COLUMNS.question_id, row_count, SubSheetInfo_POST.BACKEND_COLUMNS.wrong_answer);
        const table = await SheetAPI_POST.read(SheetInfo_POST.targetID, fa_number, range);
        console.log('table:',table)
        let api_input: {range: string, vals: string[][]}[] = [];

        for (const submission of submissions) {
            for (const data of submission.submission_data) {
                if (!data.answer_id) {
                    continue;
                }

                let wrong_answer = '';
                let correct_answer = '';

                if (data.correct) {
                    correct_answer = data.answer_id;
                } else {
                    wrong_answer = data.answer_id;
                }
                let index = binarySearch_POST(table, data.question_id);
                if (index.isFound) {
                    console.log('wrong_answer', wrong_answer)
                    console.log('correct_answer', correct_answer)

                    let sheet_corrects = EOFSplitter(table[index.index][3]);
                    let sheet_wrongs = EOFSplitter(table[index.index][4]);

                    console.log('sheet_corrects', sheet_corrects)
                    console.log('sheet_wrongs', sheet_wrongs)

                    if (correct_answer && !sheet_corrects?.includes(correct_answer)) {
                        console.log('pushed correct:', correct_answer)
                        sheet_corrects?.push(correct_answer)
                    }

                    if (wrong_answer && !sheet_wrongs?.includes(wrong_answer)) {
                        console.log('pushed wrong', wrong_answer)
                        sheet_wrongs?.push(wrong_answer)
                    }
                    
                    let corrects = EOFJoiner(sheet_corrects);
                    let wrongs = EOFJoiner(sheet_wrongs);
                    console.log('corrects', corrects)
                    console.log('wrongs', wrongs)
                    corrects = corrects ? corrects  : '';
                    wrongs = wrongs ? wrongs : '';
                    // console.log('T:', corrects, 'F', wrongs);
                    console.log('final corrects', corrects)
                    console.log('final wrongs', wrongs)
                    

                    let range = 'Y' + (index.index+2) + ':Z' + (index.index + 2);
                    api_input.push({
                        range: range,
                        vals: [[corrects, wrongs]]
                    });
                    console.log('===============================================')
                }
            }
        }
        console.log(api_input)
        api_input = this.mergeRanges(api_input)
        console.log(api_input)
        showToast('Updating sheets...', '#bfc2bf', 5000);
        await SheetAPI_POST.writeVals(SheetInfo_POST.targetID, fa_number, api_input);        
        showToast('Finished exporting!!', '#7af599', 10000);
        return;
    }

    static mergeRanges(inputs: { range: string, vals: string[][] }[]) {
        const merged: { [range: string]: { corrects: string[], wrongs: string[] } } = {};
    
        for (const input of inputs) {
            const range = input.range;
            const correct = input.vals[0][0];
            const wrong = input.vals[0][1];
    
            if (!merged[range]) {
                merged[range] = { corrects: [], wrongs: [] };
            }
    
            if (correct) {
                merged[range].corrects.push(...EOFSplitter(correct));
            }
            if (wrong) {
                merged[range].wrongs.push(...EOFSplitter(wrong));
            }
        }
    
        // Now build the final merged array
        const output = [];
    
        for (const range in merged) {
            const corrects = Array.from(new Set(merged[range].corrects)).join('**EOF**');
            const wrongs = Array.from(new Set(merged[range].wrongs)).join('**EOF**');
            output.push({
                range: range,
                vals: [[corrects, wrongs]]
            });
        }
    
        return output;
    }
    

    static columnToLetter(colIndex: number) {
        let letter = "";
        while (colIndex > 0) {
          let remainder = (colIndex - 1) % 26;
          letter = String.fromCharCode(65 + remainder) + letter;
          colIndex = Math.floor((colIndex - 1) / 26);
        }
        return letter;
      }
}