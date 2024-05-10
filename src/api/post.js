import request from '@/utils/request.js'

const POST_URL = '/admin/system/post/'

// 获取该部门及其所有子部门下面的所有岗位
export function getAllPostByDeptId(deptId = 0){
    return request({
        url: POST_URL + 'allSelfAndChildren/' + deptId,
        method: 'GET'
    })
}
// 获取所有岗位(完整信息)
export function getAllTotalPostList(){
    return request({
        url: POST_URL + 'all',
        method: 'GET'
    })
}
// 拿到新的编码(如果id为null或小于等于0时，就按照新增来返回对应的code码)
export function getNewCode(id,deptId,type){
    return request({
        url: POST_URL + `newCode/${id}/${deptId}/${type}`,
        method: 'GET'
    })
}
// 修改岗位
export function updatePost(post){
    return request({
        url: POST_URL + 'update',
        method: 'PUT',
        data: post
    })
}
// 条件查询
export function getTotalPostsByKeyword(keyword = ''){
    return request({
        url: POST_URL + 'getByKey/' + keyword,
        method: 'GET'
    })
}
// 删除单个岗位
export function removeOnePostById(postId){
    return request({
        url: POST_URL + 'remove/' + postId,
        method: 'DELETE'
    })
}
// 新建岗位
export function savePost(post = {}){
    return request({
        url: POST_URL + 'save',
        method: 'POST',
        data: post
    })
}