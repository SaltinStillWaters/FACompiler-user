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
        console.log('Exporting');
        const submissions = await this.getSubmissions(UrlInfo_POST.courseId, UrlInfo_POST.FAId, UrlInfo_POST.baseUrl);
        console.log('done export');

        const element = document.getElementById("quiz_title");
        let fa_number = '';
        if (element) {
            fa_number = element.innerText;
            fa_number = sanitizeForURL_POST(fa_number);
        } else {
            console.log('no fa number');
        }
        
        const range = computeRange_POST(SubSheetInfo_POST.BACKEND_COLUMNS.question_id, 1, SubSheetInfo_POST.BACKEND_COLUMNS.wrong_answer);
        const table = await SheetAPI_POST.read(SheetInfo_POST.targetID, fa_number, range);
        console.log(table);

        let results: {question_id: string, wrong_answer: string, correct_answer: string}[] = [];
        for (const submission of submissions) {
            for (const data of submission.submission_data) {
                if (!data.answer_id) {
                    console.log('skipping data');
                    continue;
                }

                let wrong_answer = '';
                let correct_answer = '';

                if (data.correct) {
                    correct_answer = data.answer_id;
                } else {
                    wrong_answer = data.answer_id;
                }
                //USE BATCH UPDATE TO UPDATE ALL SUBMISSIONS AT ONCE
               results.push({question_id: data.question_id, wrong_answer, correct_answer});

            }
        }
        console.log(results);
    }
}

Export.processSubmissions();