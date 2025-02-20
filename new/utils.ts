function computeRange(column: any, rowCount: number, rowStart: number = 1) {
    ++rowStart;
    let range = column + rowStart + ':' + column;
    return range += Number(Number(rowStart) + Number(rowCount) - 1);
}

function binarySearch(arr: any, toFind: any, criteria: number = 0) {
    let left = 0;
    let right = arr.length - 1;
    let result =
    {
        isFound: false,
        index: -1,
    }
    let lastMid = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const arrValue = Array.isArray(arr[mid]) ? arr[mid][0] : arr[mid];

        lastMid = mid;


        if (toFind > arrValue) {

            left = mid + 1;
        }
        else if (toFind < arrValue) {

            right = mid - 1;
        }
        else {

            result.isFound = true;
            result.index = mid;

            if (criteria === 0) {
                break;
            }
            else if (criteria === 1) {
                right = mid - 1;
            }
            else if (criteria === -1) {
                left = mid + 1;
            }
            else {
                throw new Error('Invalid argument for parameter criteria: ' + criteria);
            }
        }
    }

    result.index = result.isFound ? result.index : lastMid;

    return result;
}