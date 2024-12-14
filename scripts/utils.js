class Utils {
    static sanitizeForURL(str) {
        return str.replace(/[\/\?&=#%\"\'\\:<>\|\^\`\[\]]/g, '');
    }

    /**
     * Computes the range and returns a string in A1 notation (Example: A1:A2)
     * @param {string} column Column of the range
     * @param {number} rowStart  Starting row. 0-indexed. With 0 being row 1 in Sheets
     * @param {number} rowCount Number of rows in the range
     * @returns {string} The range in A1 notation
     */
    static computeRange(column, rowStart, rowCount) {
        ++rowStart;
        let range = column + rowStart + ':' + column;
        return range += Number(rowStart + rowCount - 1);
    }
}

function binarySearch(arr, toFind, criteria = SEARCH.DEFAULT) {


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

            if (criteria === SEARCH.DEFAULT) {
                break;
            }
            else if (criteria === SEARCH.FIRST) {
                right = mid - 1;
            }
            else if (criteria === SEARCH.LAST) {
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