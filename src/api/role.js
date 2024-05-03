import request from '@/utils/request.js'

const ROLE_URL = '/admin/system/sysRole/'

// 拿到所有的管理员
export function getAllRoles(){
    return request({
        url: ROLE_URL + 'getAll',
        method: 'GET'
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