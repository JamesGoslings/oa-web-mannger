import request from '@/utils/request.js'
const PROCESS_URL = '/admin/process/main/'

export function listPageProcess (page,limit,obj = {}){
    return request({
        url: PROCESS_URL + page + '/' + limit,
        method: 'GET',
        params: obj
    })
}