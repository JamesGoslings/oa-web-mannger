import request from '@/utils/request.js'

const INDEX_URL = '/admin/system/index/' 
 
export function login(user){
    return request({url: INDEX_URL + 'login',method: 'post',data: user,headers:{token:''}})
}