import request from '@/utils/request.js'

const INDEX_URL = '/admin/system/index/'
const USER_URL = '/admin/system/sysUser/'
 
// 拿到用户初始化信息
export function userInfo (){
    return request({
        url: INDEX_URL + 'info',
        method: 'GET'
    })
}
// 拿到全部用户信息
export function getAllUserMsg (){
    return request({
        url: USER_URL + 'all',
        method: 'GET'
    })
}
// 分页拿用户表
export function getPageUsers(page,limit,seachObj){
    return request({
        url: USER_URL + page + '/'+ limit,
        method: 'GET',
        params: seachObj
    })
}
// 修改状态值
export function updateUserStatus(userId,status){
    return request({
        url: USER_URL + 'updateStatus/' + userId + '/' + status,
        method: 'GET'
    })
}
// 检验用户名是否存在
export function checkUsernameIsExist(username = ''){
    return request({
        url: USER_URL + 'isExist',
        method: 'POST',
        data: username
    })
}
// 新建用户
export function save(user = {}){
    return request({
        url: USER_URL + 'save',
        method: 'POST',
        data: user
    })
}
// 删除单个用户
export function removeOne(id = 0){
    return request({
        url: USER_URL + 'remove/' + id,
        method: 'DELETE'
    })
}