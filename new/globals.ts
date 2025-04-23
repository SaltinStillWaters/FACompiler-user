let SPREADSHEET_ID: string = '1RdjbRszhptQ2SbSdsgzwK8Amdvn-m6MdpMQi_TOo9Ck';

class SheetInfo {
    static readonly MAIN_SHEET_ID: string = '1RdjbRszhptQ2SbSdsgzwK8Amdvn-m6MdpMQi_TOo9Ck';
    static readonly KEYS: string[] = ['target_sheet_id'];
    static #target_id: string;
    static #info_sheet_name: string = 'main';
    static #folder_id: string = '1aOLKhpj0UCuSGbXg5rOcQK4Z0frScEbd';
    static #row_count: number;
    static readonly COLUMNS = {
        'alias': 'A',
        'course_id': 'B',
        'sheet_id': 'C',
        'total': 'E1',
    }
    
    static {
        //this.#target_id = this.extractTargetID();
    }

    static async extractInfoSheetCount(): Promise<void> {
        let count = await SheetAPI.read(this.MAIN_SHEET_ID, this.infoSheetName, this.COLUMNS['total']);
        this.#row_count = count[0][0];
    }

    static async extractTargetID(): Promise<void> {
        await this.extractInfoSheetCount();
        this.#target_id = await Sheet.findSpreadSheetID(this.COLUMNS.course_id, this.COLUMNS.sheet_id, this.#row_count, this.MAIN_SHEET_ID, this.#info_sheet_name, this.#folder_id);
    }

    static overwriteTargetID(new_target_id: string): void {
        this.#target_id = new_target_id;
    }

    static get infoSheetName(): string {
        return this.#info_sheet_name;
    }

    static get targetID(): string {
        return this.#target_id;
    }
}

class SubSheetInfo {
    static readonly info_sheet_name: string = 'main';
    static readonly total_formula: string[][] = [[`=COUNTA(INDIRECT("A2:A201"))`]];
    
    static readonly column_names = ['Questions', 'Choices', 'Answers', 'Wrong Answers', 'Total'];
    static readonly col_index_widths = [[0, 777], [1, 316], [2, 192], [3, 194], [4, 36], [5, 19]];
    static readonly COLUMNS = {
        'question': 'A',
        'choice': 'B',
        'answer': 'C',
        'wrong_answer': 'D',
        'total': 'F1'
    };

    static readonly back_end_column_names = ['Question id', 'Choices', 'Choice id', 'Answers', 'Wrong Answers'];
    static readonly BACKEND_COLUMNS = {
        'question_id': 'V',
        'choice': 'W',
        'choice_id': 'X',
        'answer': 'Y',
        'wrong_answer': 'Z',
    }

    static readonly answer_formula: string[][] = [[ 
        `=GETANSWER(${this.BACKEND_COLUMNS.choice}_, ${this.BACKEND_COLUMNS.choice_id}_, ${this.BACKEND_COLUMNS.answer}_)`
    ]]

    static readonly wrong_answer_formula: string[][] = [[ 
        `=GETANSWER(${this.BACKEND_COLUMNS.choice}_, ${this.BACKEND_COLUMNS.choice_id}_, ${this.BACKEND_COLUMNS.wrong_answer}_)`
    ]]
}
class UrlInfo {
    static readonly KEYS: string[] = ['url', 'base_url', 'course_id', 'FA_id', 'question_id'];

    static #base_url: string;
    static #course_id: string;
    static #FA_id: string;
    static #question_id: string;
    static #url: string;

    static {
        this.#url = window.location.href;
        this.#base_url = this.#extract_base_url(this.#url);
        this.#course_id = this.#extract_course_id(this.#url);
        this.#FA_id = this.#extract_FA_id(this.#url);
        this.#question_id = this.#extract_question_id(this.#url);
    }
    
    static update(): void {
        this.#url = window.location.href;
        this.#base_url = this.#extract_base_url(this.#url);
        this.#course_id = this.#extract_course_id(this.#url);
        this.#FA_id = this.#extract_FA_id(this.#url);
        this.#question_id = this.#extract_question_id(this.#url);
    }

    static updateWithDict(dict: {[key: string]: string}): void {
        this.#url = dict['url'];
        this.#base_url = dict['base_url'];
        this.#course_id = dict['course_id'];
        this.#FA_id = dict['FA_id'];
        this.#question_id = dict['question_id'];
    }

    static getValsAsArray(): string[] {
        return [this.#url, this.#base_url, this.#course_id, this.FAId, this.#question_id];
    }

    static get url(): string {
        return this.#url;
    }

    static get baseUrl(): string {
        return this.#base_url;
    }

    static get courseId(): string {
        return this.#course_id;
    }

    static get FAId(): string {
        return this.#FA_id;
    }

    static get questionId(): string {
        return this.#question_id;
    }

    static #extract_base_url(url: string): string {
        const url_tokens = url.split('/');
        let result: string = `${url_tokens[0]}//${url_tokens[2]}/`;

        if (!result)
            throw new Error('>> FA_id could not be found');

        return result;
    }
    
    static #extract_course_id(url: string): string {
        let result: string = url.split('courses/')[1].split('/')[0];

        if (!result)
            throw new Error('>> course_id could not be found');

        return result;
    }

    static #extract_FA_id(url: string): string {
        let result: string = url.split('quizzes/')[1].split('/')[0];
    
        if (!result)
            throw new Error('>> FA_id could not be found');

        return result;
    }

    static #extract_question_id(url: string): string {
        let result: string = url.split('questions/')[1];

        if (!result) {
            let question_link = document.querySelector('a[name^="question_"]')

            try {
                if (question_link) {
                    let temp = question_link.getAttribute('name');
    
                    if (temp)   
                        result = temp.split('_')[1];    
                }
            } catch {
                throw new Error('>> question_id could not be found here');
            }
        }
        
        if (!result)
            throw new Error('>> question_id could not be found');
        
        return result;
    }
}