import request from '@/utils/request.js'
const DEPT_URL = '/admin/system/dept/'

// 拿到原始的所有部门的列表
export function getAllDept(){
    return request({
        url: DEPT_URL + 'all',
        method: 'GET'
    })
}
// 拿到树型的所有的部门列表并附上人数信息
export function getTreeDeptList(){
    return request({
        url: DEPT_URL + 'allTree',
        method: 'GET'
    })
}