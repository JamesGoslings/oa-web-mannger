// 处理字符串的工具类
// 判断是不是空白字符串或是null
export function isSpace(str){
    return str == null || /^\s*$/.test(str);
}