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
        //some code
    })
    .catch((error) => {
        //some code
    })

async function updateLocalData(): Promise<void> {
    let dict: { [key: string]: string } = {};

    await SheetInfo.extractTargetID();
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