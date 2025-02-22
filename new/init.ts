const RENEWAL_KEYS = ['course_id', 'target_sheet_id'];

(async () => {
try {
    const local_data = await chrome.storage.local.get(RENEWAL_KEYS)
    
    if (local_data['course_id'] === UrlInfo.courseId) {
        console.log('local_data is up to date');
        SheetInfo.overwriteTargetID(local_data['target_sheet_id']);
    } else {
        console.log('needs update');
        await updateLocalData();
    }

    console.log('target id: ', SheetInfo.targetID);
} catch (error) {
    console.error(error);    
}
})();
    

async function updateLocalData(): Promise<void> {
    let dict: { [key: string]: string } = {};

    await SheetInfo.setTargetID();
    const vals: string[] = [UrlInfo.courseId, SheetInfo.targetID];

    RENEWAL_KEYS.forEach((key, index) => {
        dict[key] = vals[index];
    });

    await chrome.storage.local.set(dict);
}














// chrome.storage.local.get(UrlInfo.KEYS)
//     .then(local_data => {
//         if (local_data['url'] === UrlInfo.url) {
//             console.log('updated');
//             URL
//             return;
//         }
        
//         console.log('needs update')
//         UrlInfo.update();
//         return updateLocalData();
//     })
//     .then(() => {
//         //some code
//     })
//     .catch((error) => {
//         //some code
//     })
    
// async function updateLocalData(): Promise<void> {
//     let dict: { [key: string]: string } = {};
//     const vals: string[] = UrlInfo.getValsAsArray();

//     UrlInfo.KEYS.forEach((key, index) => {
//         dict[key] = vals[index];
//     });

//     await chrome.storage.local.set(dict);
// }