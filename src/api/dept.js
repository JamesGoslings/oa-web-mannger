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
// 拿到完整的部门信息(列表结构
export function getAllTotalDeptList(){
    return request({
        url: DEPT_URL + 'allList',
        method: 'GET'
    })
}
// 修改部门
export function updateDept(dept = {}){
    return request({
        url: DEPT_URL + 'update',
        method: 'PUT',
        data: dept
    })
}
// 新建部门
export function saveDept(dept = {}){
    return request({
        url: DEPT_URL + 'save',
        method: 'POST',
        data: dept
    })
}
// 动态拿到新的部门编码
export function getNewDeptCode(deptId,parentId){
    return request({
        url: DEPT_URL + `newCode/${deptId}/${parentId}`,
        method: 'GET'
    })
}
// 删除一个部门
export function removeOneDeptById(deptId){
    return request({
        url: DEPT_URL + 'remove/' + deptId,
        method: 'DELETE'
    })
}