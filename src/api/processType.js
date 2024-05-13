import request from '@/utils/request.js'
const PROCESS_TYPE_URL = '/admin/process/processType/'

// 获取分页数据
export function getProcessTypePage(page = 0,limit = 0,obj = {keyword: ''}){
    return request({
        url: PROCESS_TYPE_URL + `${page}/${limit}`,
        method: 'GET',
        params: obj
    })
}
// 获取全部数据
export function getAllProcessTypes (){
    return request({
        url: PROCESS_TYPE_URL + 'all',
        method: 'GET'
    })
}
// 删除单个类型
export function removeOneProcessType (id){
    return request({
        url: PROCESS_TYPE_URL + 'remove/' + id,
        method: 'DELETE'
    })
}