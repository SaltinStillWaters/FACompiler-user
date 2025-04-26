const RENEWAL_KEYS_POST = ['course_id', 'target_sheet_id', 'fa_id'];
chrome.runtime.onMessage.addListener((request, sender, response) => {
    initMain().then(() => {
        response({ result: "Export completed" });
    }).catch((error) => {
        response({ error: error.message });
    });
    return true;
})

async function initMain() {
try {
    const local_data = await chrome.storage.local.get(RENEWAL_KEYS_POST)
    
    if (local_data['course_id'] === UrlInfo_POST.courseId && local_data['fa_id'] === UrlInfo_POST.FAId) {
        SheetInfo_POST.overwriteTargetID(local_data['target_sheet_id']);
    } else {
        await updateLocalData();
    }

    await Export.processSubmissions();
} catch (error) {
    console.error(error);    
}

async function updateLocalData(): Promise<void> {
    let dict: { [key: string]: string } = {};

    await SheetInfo_POST.extractTargetID();
    const vals: string[] = [UrlInfo_POST.courseId, SheetInfo_POST.targetID, UrlInfo_POST.FAId];

    RENEWAL_KEYS_POST.forEach((key, index) => {
        dict[key] = vals[index];
    });

    await chrome.storage.local.set(dict);
}
}