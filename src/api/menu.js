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
// 为对应角色分配权限
export function doAssignForRole(assignObj = {}){
    return request({
        url: MENU_URL + 'doAssign',
        method: 'POST',
        data: assignObj
    })
}
// 修改菜单信息
export function updateMenu(menu = {}){
    return request({
        url: MENU_URL + 'update',
        method: 'PUT',
        data: menu
    })
}
// 根据输入值获取树型的相关菜单
export function getMenuListByKeyword(keyword = ''){
    return request({
        url: MENU_URL + 'keyMenu?keyword=' + keyword,
        method: 'GET'
    })
}
// 获取所有的非按钮菜单的列表（含父级字符串）
export function getParentMenuAll(){
    return request({
        url: MENU_URL + 'getParentMenuAll',
        method: 'GET'
    })
}
// 删除单个菜单
export function removeOneMenuById(id){
    return request({
        url: MENU_URL + 'remove/' + id,
        method: 'DELETE'
    })
}
// 新建菜单
export function saveMenu(menu = {}){
    return request({
        url: MENU_URL + 'save',
        method: 'POST',
        data: menu
    })
}