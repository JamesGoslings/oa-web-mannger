import request from '@/utils/request.js'
const ATTENDANCE_URL = '/admin/attendance/clockInRecord/'

// 获取全公司一定时间内的打卡率集合
export function listRadiusByDays(days = 0){
    return request({
        url: ATTENDANCE_URL + 'radius/' + days,
        method: 'GET'
    })
}

// 获取一些部门的打卡率
export function listDeptRadius(idList = [],days = 0){
    return request({
        url: ATTENDANCE_URL + 'deptRedius/' + days,
        method: 'POST',
        data: idList
    })
}