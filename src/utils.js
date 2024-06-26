module.exports.hasCommonConsecutiveChars = (str1, str2, length) => {
    let result = false;
    const segmentLength = str1.length - length + 1;
    for (let index = 0; index < segmentLength; index++) {
        const compareStr = str1.slice(index, index + length);
        // 包含数字，可能是门牌
        if(
            /[a-z]|[A-Z]|[0-9]|一|二|三|四|五|六|七|八|九|十|唯一|绿化|标识|叉口|（|）|，|污水|漏|阀|管|巡|东面|南面|西面|北面|东南|东北|西南|西北|路|区|市|省|号|门口|大门|由.向|.侧|加油站|阀门|警务站/.test(compareStr)

        ) {
            continue;
        }

        const str2Index = str2.indexOf(compareStr);
        if(str2Index !== -1 && 
            (str1.slice(index) !== str2.slice(str2Index) ||
              (index === str2Index && index === 0)
            )) {
            result = index
            break;
        }
    }
    return result;
}

module.exports.test = (str1, str2, length) => {
       // Helper function to find consecutive characters in a string
       function findConsecutiveChars(str) {
        let consecutiveChars = [];
        let count = 1;

        for (let i = 1; i < str.length; i++) {
            if (str[i] === str[i - 1] && isNaN(str[i])) {
                count++;
            } else {
                if (count >= length) {
                    consecutiveChars.push(str.slice(i - count, i));
                }
                count = 1;
            }
        }

        // Check the last sequence
        if (count >= length) {
            consecutiveChars.push(str.slice(str.length - count));
        }

        return consecutiveChars;
    }

    // Find consecutive characters in both strings
    let consecutiveCharsStr1 = findConsecutiveChars(str1);
    let consecutiveCharsStr2 = findConsecutiveChars(str2);

    // Check if any of the sequences match
    for (let seq1 of consecutiveCharsStr1) {
        for (let seq2 of consecutiveCharsStr2) {
            if (seq1 === seq2) {
                return true;
            }
        }
    }

    return false;
}