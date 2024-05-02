import request from '@/utils/request.js'
const DEPT_URL = '/admin/system/dept/'

export function getAllDept(){
    return request({
        url: DEPT_URL + 'all',
        method: 'GET'
    })
}