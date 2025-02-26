"use strict";
const RENEWAL_KEYS_POST = ['course_id', 'target_sheet_id', 'fa_id'];
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.action === 'activateExport') {
        initMain();
        console.log('message recieved');
    }
});
async function initMain() {
    try {
        console.log('Post');
        const local_data = await chrome.storage.local.get(RENEWAL_KEYS_POST);
        if (local_data['course_id'] === UrlInfo_POST.courseId && local_data['fa_id'] === UrlInfo_POST.FAId) {
            console.log('local_data is up to date');
            SheetInfo_POST.overwriteTargetID(local_data['target_sheet_id']);
        }
        else {
            console.log('needs update');
            await updateLocalData();
        }
        console.log('target id: ', SheetInfo_POST.targetID);
        await Export.processSubmissions();
    }
    catch (error) {
        console.error(error);
    }
    async function updateLocalData() {
        let dict = {};
        await SheetInfo_POST.extractTargetID();
        const vals = [UrlInfo_POST.courseId, SheetInfo_POST.targetID, UrlInfo_POST.FAId];
        RENEWAL_KEYS_POST.forEach((key, index) => {
            dict[key] = vals[index];
        });
        await chrome.storage.local.set(dict);
    }
}
//# sourceMappingURL=initPost.js.map