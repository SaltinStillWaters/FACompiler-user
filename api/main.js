(async function () {
    const currentURL = window.location.href;
    const courseId = parseInt(currentURL.split('courses/')[1].split('/')[0]);
    const quizId = parseInt(currentURL.split('quizzes/')[1].split('/')[0]);
    const urlTokens = currentURL.split('/');
    const baseUrl = `${urlTokens[0]}//${urlTokens[2]}/`;

    if (!courseId) {
    logger.error('Unable to retrieve course id');
  } else if (!quizId) {
    logger.error('Unable to retrieve quiz id');
  }
  console.log({currentURL, courseId, quizId, baseUrl})

    async function getQuizSubmissions(courseId, quizId, baseUrl) {
        const quizUrl = `${baseUrl}api/v1/courses/${courseId}/quizzes/${quizId}/`;
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
        return fetch(submissionsHistoryUrl).then(res => res.text()).then(res => JSON.parse(res).submission_history);
    }
    
    console.log(await getQuizSubmissions(courseId, quizId, baseUrl))
})();