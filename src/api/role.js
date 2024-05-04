import request from '@/utils/request.js'

const ROLE_URL = '/admin/system/sysRole/'

// 拿到所有的管理员
export function getAllRoles(){
    return request({
        url: ROLE_URL + 'getAll',
        method: 'GET'
    })
}
// 分页拿角色
export function getRolePage(page = 0,limit = 0,obj = {keyword: ''}){
    return request({
        url: ROLE_URL + page + '/' + limit,
        method: 'GET',
        params: obj
    })
}
// 拿到对应用户拥有的管理员
export function getAssignByUserId(userId){
    return request({
        url: ROLE_URL + 'toAssign/' + userId,
        method: 'GET'
    })
}
// 为对应用户分配角色
export function doAssign(assignMsg){
    return request({
        url: ROLE_URL + 'doAssign',
        method: 'POST',
        data: assignMsg
    })
}
// 删除单个角色
export function removeOneRoleById(id){
    return request({
        url: ROLE_URL + 'remove/' + id,
        method: 'DELETE'
    })
}
// 修改角色
export function updateRole(role){
    return request({
        url: ROLE_URL + 'update',
        method: 'PUT',
        data: role
    })
}