"use strict";
class Canvas {
    static buildBackendValues() {
        let choices = this.raw_choices.map(choice => choice.choice_text).join('**EOF**');
        let choice_ids = this.raw_choices.map(choice => choice.choice_id).join('**EOF**');
        let result = [UrlInfo.questionId, choices, choice_ids];
        return result;
    }
    static buildFrontendValues() {
        let choices = this.raw_choices.map(choice => choice.choice_text).join('\n\n');
        let result = [Canvas.question, choices];
        return result;
    }
    static extractFANumber() {
        const header = document.querySelector('header.quiz-header');
        if (!header) {
            throw new Error("'header.quiz-header' not found");
        }
        const h1 = header.querySelector('h1');
        if (!h1) {
            throw new Error("'h1' not found");
        }
        const FANumber = h1.textContent;
        if (!FANumber) {
            throw new Error("'FANumber' not found or empty");
        }
        this.fa_number = sanitizeForURL(FANumber);
        console.log(this.fa_number);
    }
    static extractQuestion() {
        const questionElement = document.querySelector('.display_question');
        if (!questionElement)
            throw new Error('No question found');
        let questionTextElement = questionElement.querySelector('.question_text p');
        if (!questionTextElement) {
            questionTextElement = questionElement.querySelector('.question_text span');
        }
        let result = questionTextElement.innerText.trim();
        if (!result)
            throw new Error('No question found');
        Canvas.question = result;
        console.log(result);
    }
    static extractChoices() {
        const answerElements = document.querySelectorAll('.answer');
        const result = Array.from(answerElements).map(answer => {
            const inputElement = answer.querySelector('input.question_input');
            const choice_id = inputElement.value;
            const labelElement = answer.querySelector('.answer_label');
            const choice_text = labelElement.innerText.trim();
            return { choice_id, choice_text };
        });
        if (!result)
            throw new Error('No choices found');
        Canvas.raw_choices = result;
        console.log(result);
    }
}
//# sourceMappingURL=canvas.js.map