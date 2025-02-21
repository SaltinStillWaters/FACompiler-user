let SPREADSHEET_ID: string = '15Pi3Atd2kAlFCFR2Rcs4bGrjOkxMok_nCVGSfVTIuLQ';

class SheetInfo {
    static readonly MAIN_SHEET_ID: string = '15Pi3Atd2kAlFCFR2Rcs4bGrjOkxMok_nCVGSfVTIuLQ';
    static readonly KEYS: string[] = ['target_sheet_id'];
    static #target_id: string;
    static #info_sheet_name: string = 'main';
    static #row_count: number;

    static readonly COLUMNS = {
        'course_id': 'A',
        'sheet_id': 'B',
        'total': 'D1',
    }
    
    static {
        //this.#target_id = this.extractTargetID();
    }

    static async setInfoSheetCount(): Promise<void> {
        let count = await Sheet.read(this.MAIN_SHEET_ID, this.infoSheetName, this.COLUMNS['total']);
        this.#row_count = count[0][0];
    }

    static async extractTargetID(): Promise<void> {
        await this.setInfoSheetCount();
        console.log(this.#row_count)
        let range: any = computeRange(this.COLUMNS['sheet_id'], this.#row_count);
        console.log(range);
        let res = await Sheet.read(this.MAIN_SHEET_ID, this.#info_sheet_name, range);
        console.log('table extracted', res);
        console.log('creating new spreadsheet');

        const a = await(Sheet.createSpreadSheet('sub_spreadsheet', '1aOLKhpj0UCuSGbXg5rOcQK4Z0frScEbd'))
        console.log('spreadsheet created')
        return;
    }

    static get infoSheetName(): string {
        return this.#info_sheet_name;
    }

    static get targetID(): string {
        return this.#target_id;
    }
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

        //console.log('1: ', this.#base_url, '1: ',  this.#course_id, '1: ',  this.#FA_id, '1: ',  this.#question_id)
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