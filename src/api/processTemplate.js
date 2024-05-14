import request from '@/utils/request.js'
const PROCESS_TEMPLETE_URL = '/admin/process/processTemplate/'

// 获取模板的分页数据
export function getProcessTemplatePage(page = 0,limit = 0,obj = {keyword: ''}){
    return request({
        url: PROCESS_TEMPLETE_URL + `${page}/${limit}`,
        method: 'GET',
        params: obj
    })
}
// 获取全部的模板
export function getProcessTemplateAll(){
    return request({
        url: PROCESS_TEMPLETE_URL + 'all',
        method: 'GET'
    })
}
// 新建模板
export function saveProcessTemplate(template){
    return request({
        url: PROCESS_TEMPLETE_URL + 'save',
        method: 'POST',
        data: template
    })
}
// 修改模板
export function updateProcessTemplate(template){
    return request({
        url: PROCESS_TEMPLETE_URL + 'update',
        method: 'PUT',
        data: template
    })
}
// 删除模板
export function removeProcessTemplate(id){
    return request({
        url: PROCESS_TEMPLETE_URL + 'remove/' + id,
        method: 'DELETE'
    })
}
// 批量删除
export function batchRemoveProcessTemlates(idList){
    return request({
        url: PROCESS_TEMPLETE_URL + 'batchRemove',
        method: 'DELETE',
        data: idList
    })
}