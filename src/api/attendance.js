import request from '@/utils/request.js'
const ATTENDANCE_URL = '/admin/attendance/clockInRecord/'

export function listRadiusByDays(days = 0){
    return request({
        url: ATTENDANCE_URL + 'radius/' + days,
        method: 'GET'
    })
}