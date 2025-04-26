"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _SheetInfo_POST_target_id, _SheetInfo_POST_info_sheet_name, _SheetInfo_POST_folder_id, _SheetInfo_POST_row_count, _b, _UrlInfo_POST_base_url, _UrlInfo_POST_course_id, _UrlInfo_POST_FA_id, _UrlInfo_POST_question_id, _UrlInfo_POST_url, _UrlInfo_POST_extract_base_url, _UrlInfo_POST_extract_course_id, _UrlInfo_POST_extract_FA_id, _UrlInfo_POST_extract_question_id;
let SPREADSHEET_ID_POST = '15Pi3Atd2kAlFCFR2Rcs4bGrjOkxMok_nCVGSfVTIuLQ';
class SheetInfo_POST {
    static async extractInfoSheetCount() {
        let count = await SheetAPI_POST.read(this.MAIN_SHEET_ID, this.infoSheetName, this.COLUMNS['total']);
        __classPrivateFieldSet(this, _a, count[0][0], "f", _SheetInfo_POST_row_count);
    }
    static async extractTargetID() {
        await this.extractInfoSheetCount();
        __classPrivateFieldSet(this, _a, await Sheet_POST.findSpreadSheetID(this.COLUMNS.course_id, this.COLUMNS.sheet_id, __classPrivateFieldGet(this, _a, "f", _SheetInfo_POST_row_count), this.MAIN_SHEET_ID, __classPrivateFieldGet(this, _a, "f", _SheetInfo_POST_info_sheet_name), __classPrivateFieldGet(this, _a, "f", _SheetInfo_POST_folder_id)), "f", _SheetInfo_POST_target_id);
    }
    static overwriteTargetID(new_target_id) {
        __classPrivateFieldSet(this, _a, new_target_id, "f", _SheetInfo_POST_target_id);
    }
    static get infoSheetName() {
        return __classPrivateFieldGet(this, _a, "f", _SheetInfo_POST_info_sheet_name);
    }
    static get targetID() {
        return __classPrivateFieldGet(this, _a, "f", _SheetInfo_POST_target_id);
    }
}
_a = SheetInfo_POST;
SheetInfo_POST.MAIN_SHEET_ID = '15Pi3Atd2kAlFCFR2Rcs4bGrjOkxMok_nCVGSfVTIuLQ';
SheetInfo_POST.KEYS = ['target_sheet_id'];
_SheetInfo_POST_target_id = { value: void 0 };
_SheetInfo_POST_info_sheet_name = { value: 'main' };
_SheetInfo_POST_folder_id = { value: '1aOLKhpj0UCuSGbXg5rOcQK4Z0frScEbd' };
_SheetInfo_POST_row_count = { value: void 0 };
SheetInfo_POST.COLUMNS = {
    'alias': 'A',
    'course_id': 'B',
    'sheet_id': 'C',
    'total': 'E1',
};
(() => {
})();
class SubSheetInfo_POST {
}
SubSheetInfo_POST.info_sheet_name = 'main';
SubSheetInfo_POST.total_formula = [[`=COUNTA(INDIRECT("A2:A201"))`]];
SubSheetInfo_POST.column_names = ['Questions', 'Choices', 'Answers', 'Wrong Answers', 'Total'];
SubSheetInfo_POST.col_index_widths = [[0, 777], [1, 316], [2, 192], [3, 194], [4, 36], [5, 19]];
SubSheetInfo_POST.COLUMNS = {
    'question': 'A',
    'choice': 'B',
    'answer': 'C',
    'wrong_answer': 'D',
    'total': 'F1'
};
SubSheetInfo_POST.back_end_column_names = ['Question id', 'Choices', 'Choice id', 'Answers', 'Wrong Answers'];
SubSheetInfo_POST.BACKEND_COLUMNS = {
    'question_id': 'V',
    'choice': 'W',
    'choice_id': 'X',
    'answer': 'Y',
    'wrong_answer': 'Z',
};
class UrlInfo_POST {
    static update() {
        __classPrivateFieldSet(this, _b, window.location.href, "f", _UrlInfo_POST_url);
        __classPrivateFieldSet(this, _b, __classPrivateFieldGet(this, _b, "m", _UrlInfo_POST_extract_base_url).call(this, __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_base_url);
        __classPrivateFieldSet(this, _b, __classPrivateFieldGet(this, _b, "m", _UrlInfo_POST_extract_course_id).call(this, __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_course_id);
        __classPrivateFieldSet(this, _b, __classPrivateFieldGet(this, _b, "m", _UrlInfo_POST_extract_FA_id).call(this, __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_FA_id);
        __classPrivateFieldSet(this, _b, __classPrivateFieldGet(this, _b, "m", _UrlInfo_POST_extract_question_id).call(this, __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_question_id);
    }
    static updateWithDict(dict) {
        __classPrivateFieldSet(this, _b, dict['url'], "f", _UrlInfo_POST_url);
        __classPrivateFieldSet(this, _b, dict['base_url'], "f", _UrlInfo_POST_base_url);
        __classPrivateFieldSet(this, _b, dict['course_id'], "f", _UrlInfo_POST_course_id);
        __classPrivateFieldSet(this, _b, dict['FA_id'], "f", _UrlInfo_POST_FA_id);
        __classPrivateFieldSet(this, _b, dict['question_id'], "f", _UrlInfo_POST_question_id);
    }
    static getValsAsArray() {
        return [__classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_url), __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_base_url), __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_course_id), this.FAId, __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_question_id)];
    }
    static get url() {
        return __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_url);
    }
    static get baseUrl() {
        return __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_base_url);
    }
    static get courseId() {
        return __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_course_id);
    }
    static get FAId() {
        return __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_FA_id);
    }
    static get questionId() {
        return __classPrivateFieldGet(this, _b, "f", _UrlInfo_POST_question_id);
    }
}
_b = UrlInfo_POST, _UrlInfo_POST_extract_base_url = function _UrlInfo_POST_extract_base_url(url) {
    const url_tokens = url.split('/');
    let result = `${url_tokens[0]}//${url_tokens[2]}/`;
    if (!result)
        throw new Error('>> FA_id could not be found');
    return result;
}, _UrlInfo_POST_extract_course_id = function _UrlInfo_POST_extract_course_id(url) {
    let result = url.split('courses/')[1].split('/')[0];
    if (!result)
        throw new Error('>> course_id could not be found');
    return result;
}, _UrlInfo_POST_extract_FA_id = function _UrlInfo_POST_extract_FA_id(url) {
    let result = url.split('quizzes/')[1].split('/')[0];
    if (!result)
        throw new Error('>> FA_id could not be found');
    return result;
}, _UrlInfo_POST_extract_question_id = function _UrlInfo_POST_extract_question_id(url) {
    let result = url.split('questions/')[1];
    if (!result) {
        let question_link = document.querySelector('a[name^="question_"]');
        try {
            if (question_link) {
                let temp = question_link.getAttribute('name');
                if (temp)
                    result = temp.split('_')[1];
            }
        }
        catch {
        }
    }
    return result;
};
UrlInfo_POST.KEYS = ['url', 'base_url', 'course_id', 'FA_id', 'question_id'];
_UrlInfo_POST_base_url = { value: void 0 };
_UrlInfo_POST_course_id = { value: void 0 };
_UrlInfo_POST_FA_id = { value: void 0 };
_UrlInfo_POST_question_id = { value: void 0 };
_UrlInfo_POST_url = { value: void 0 };
(() => {
    __classPrivateFieldSet(_b, _b, window.location.href, "f", _UrlInfo_POST_url);
    __classPrivateFieldSet(_b, _b, __classPrivateFieldGet(_b, _b, "m", _UrlInfo_POST_extract_base_url).call(_b, __classPrivateFieldGet(_b, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_base_url);
    __classPrivateFieldSet(_b, _b, __classPrivateFieldGet(_b, _b, "m", _UrlInfo_POST_extract_course_id).call(_b, __classPrivateFieldGet(_b, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_course_id);
    __classPrivateFieldSet(_b, _b, __classPrivateFieldGet(_b, _b, "m", _UrlInfo_POST_extract_FA_id).call(_b, __classPrivateFieldGet(_b, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_FA_id);
    __classPrivateFieldSet(_b, _b, __classPrivateFieldGet(_b, _b, "m", _UrlInfo_POST_extract_question_id).call(_b, __classPrivateFieldGet(_b, _b, "f", _UrlInfo_POST_url)), "f", _UrlInfo_POST_question_id);
})();
//# sourceMappingURL=globalsPost.js.map