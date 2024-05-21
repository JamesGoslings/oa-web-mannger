/**
 * 存静态数据
*/

// 所有的图标
export const iconList = [
    '',
    '&#xea19;','&#xe999;','&#xe843;','&#xe6aa;',
    '&#xe6a8;','&#xe696;','&#xe646;','&#xe642;',
    '&#xe63f;','&#xe63e;','&#xe63a;','&#xe631;',
    '&#xe62e;','&#xe60c;','&#xe605;','&#xe605;',
    '&#xe640;'
]

// 菜单类型列表
export const typeList = ['目录','菜单','按钮']

// 岗位类型列表
export const postTypeList = ['其他','管理岗','技术岗','销售岗','研发岗']

// 所有的审批图标
export const processIconList = [
    '',
    '&#xe60e;','&#xebf1;','&#xe616;','&#xe6c2;',
    '&#xe64d;','&#xe6c7;','&#xeabb;','&#xebcc;',
    '&#xebf0;'
]

// 根据审批的status获取状态名和样式
export function getStatusObj(status){
    let statusObj = {name: '已驳回',backColor: 'rgb(252,245,237)',fontColor: 'rgb(234,123,54)'}
    if(status === 1){
        statusObj.name = '申请中'
        statusObj.backColor = 'rgb(244,249,255)'
        statusObj.fontColor = 'rgb(60,118,244)'
    }else if(status === 2){
        statusObj.name = '已通过'
        statusObj.backColor = 'rgb(240,249,235)'
        statusObj.fontColor = '#67C23A'
    }else if(status === 0){
        statusObj.name = '无状态'
    }
    return statusObj
}