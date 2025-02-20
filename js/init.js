"use strict";
const RENEWAL_KEYS = ['course_id', 'target_sheet_id'];
chrome.storage.local.get(RENEWAL_KEYS)
    .then(local_data => {
    if (local_data['course_id'] === UrlInfo.courseId) {
        console.log('up to date');
        return;
    }
    console.log('needs update');
    return updateLocalData();
})
    .then(async () => {
    await SheetInfo.extractTargetID();
})
    .catch((error) => {
});
async function updateLocalData() {
    let dict = {};
    await SheetInfo.extractTargetID();
    const vals = [UrlInfo.courseId, SheetInfo.targetID];
    RENEWAL_KEYS.forEach((key, index) => {
        dict[key] = vals[index];
    });
    await chrome.storage.local.set(dict);
}
//# sourceMappingURL=init.js.map