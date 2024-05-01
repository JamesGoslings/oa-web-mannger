import request from '@/utils/request.js'

const INDEX_URL = '/admin/system/index/'
const USER_URL = '/admin/system/sysUser/'
 
// 拿到用户初始化信息
export function userInfo (){
    return request(
        {
            url: INDEX_URL + 'info',
            method: 'GET'
        }
    )
}
// 分页拿用户表
export function getPageUsers(page,limit,seachObj){
    return request(
        {
            url: USER_URL + page + '/'+ limit,
            method: 'GET',
            params: seachObj
        }
    )
}