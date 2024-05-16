// 处理字符串的工具类

// 判断是不是空白字符串或是null
export function isSpace(str){
    return str == null || /^\s*$/.test(str);
}
// 去除一个字符串中空白字符
export function removeWhiteSpaces(str) {
    // 使用正则表达式匹配所有空白字符，并用空字符串替换它们
    return str.replace(/\s/g, '');
}
// 处理日期字符串 将完全字符串转成MM.DD格式
export function choreDateStr(dateString){
    let parts = dateString.split(' ')[0].split('-');
    let month = parts[1];
    let day = parts[2].trim(); // 去除字符串两端的空格
    return `${month}.${day}`;
}