export function mergeSortDescBytotalCount(arr) {  
    // 递归终止条件：数组长度为0或1，无需排序  
    if (arr.length <= 1) {  
        return arr;
    }
    // 分割数组  
    const mid = Math.floor(arr.length / 2);  
    const left = arr.slice(0, mid);  
    const right = arr.slice(mid);  

    // 递归排序左右两边  
    left = mergeSortDescBytotalCount(left);  
    right = mergeSortDescBytotalCount(right);  

    // 合并两个已排序的数组  
    return mergeDescBytotalCount(left, right);
}  
    
function mergeDescBytotalCount(left, right) {
    let result = [];
    let leftIndex = 0;  
    let rightIndex = 0;  

    // 合并两个数组  
    while (leftIndex < left.length && rightIndex < right.length) {  
        // 如果左边的count小于或等于右边的count，则右边的先放入结果数组  
        if (left[leftIndex].totalCount <= right[rightIndex].totalCount) {
            result.push(right[rightIndex++]);
        } else {
            result.push(left[leftIndex++]);
        }
    }

    // 如果左边数组还有剩余元素，将它们添加到结果数组中
    while (leftIndex < left.length) {
        result.push(left[leftIndex++]);
    }  

    // 如果右边数组还有剩余元素，将它们添加到结果数组中  
    while (rightIndex < right.length) {  
        result.push(right[rightIndex++]);  
    }

    return result;
}