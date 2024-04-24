import request from '@/utils/request.js'

const INDEX_URL = '/admin/system/index/' 
 
// 拿到用户初始化信息
export function userInfo (){
    return request(
        {
            url: INDEX_URL + 'info',
            method: 'GET'
        }
    )
}