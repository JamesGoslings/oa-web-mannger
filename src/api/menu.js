import request from '@/utils/request.js'

const MENU_URL = '/admin/system/sysMenu/'

// 拿到roleId对应有的菜单列表
export function getMenuListByRoleId(roleId){
    return request({
        url: MENU_URL + 'toAssign/' + roleId,
        method: 'GET'
    })
}
// 拿到roleId对应的所有没有子节点的菜单id
export function getMenuIdListWithoutChilrenByRoleId(roleId){
    return request({
        url: MENU_URL + 'getMyIdsWithoutChildren/' + roleId,
        method: 'GET'
    })
}
// 拿到树型结构的所有菜单
export function getAllTreeMenus(){
    return request({
        url: MENU_URL + 'getNodes',
        method: 'GET'
    })
}