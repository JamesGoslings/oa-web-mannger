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
// 拿到新的编码
export function getNewCode(id,deptId,type){
    return request({
        url: POST_URL + `newCode/${id}/${deptId}/${type}`,
        method: 'GET'
    })
}