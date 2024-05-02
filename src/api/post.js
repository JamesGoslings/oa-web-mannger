import request from '@/utils/request.js'

const POST_URL = '/admin/system/post/'

export function getAllPostByDeptId(deptId = 0){
    return request({
        url: POST_URL + 'allSelfAndChildren/' + deptId,
        method: 'GET'
    })
}