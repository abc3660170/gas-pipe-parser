var XLSX = require("xlsx");
const { hasCommonConsecutiveChars } = require("./src/utils");

const workbook = XLSX.readFile("D:\\\\wsworkspace\\gas-pipe-parser\\data\\demo.xlsx");

const worksheet = workbook.Sheets['Sheet0'];

const data = XLSX.utils.sheet_to_json(worksheet)

const usedRecords = [];

const totalGroup = [];

const filteredList = data.filter( row => {
    const paigongshijian = row['派工时间']
    const date = new Date(/\w+-\w+-\w+\s+\w+:\w+:\w+/.exec(paigongshijian)[0]);
    return date > new Date('2023-05-01') && 
            date < new Date('2024-04-30')
});

const total = filteredList.length;

filteredList.forEach( (row, index) => {
    let repeatRecords = []
    console.log(`${total}-${index}`)
    if(!usedRecords.includes(index)) {
        usedRecords.push(index);
        const temp = {};
        for (let j = index + 1; j < filteredList.length; j++) {
            if(!usedRecords.includes(j)) {
                const element = filteredList[j];
                const result = hasCommonConsecutiveChars(row['故障地址'], element['故障地址'], 3)
                if(result !== false){
                    if(!temp[result]){
                        temp[result] = [j];
                    } else {
                        temp[result].push(j);
                    }
                }
            }      
        }
        const keys = Object.keys(temp)
        for (const key of keys) {
            if(temp[key].length >= 3) {
                repeatRecords = {
                    index: key,
                    list: [row]
                }
                temp[key].forEach( index => {
                    repeatRecords.list.push(filteredList[index]);
                    usedRecords.push(index);
                })
                break;
            }
        }

        if(repeatRecords?.list?.length >= 3) {
            totalGroup.push(repeatRecords);
        }
    }
})

// 输出

totalGroup.sort((a, b) => b.list.length - a.list.length).forEach(group => {
    let stop = index = group.index;
    const list = group.list;
    let name = '';
    let loop = true;
    while(loop) {
        name = list[0]['故障地址'].slice(index, ++stop);
        loop = list.map( item => item['故障地址']).slice(1).some(i => i.slice(index, stop) !== name);
    }
    console.log(`${name}, ${list.length}`)
})


