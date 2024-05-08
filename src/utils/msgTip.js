import { ElMessage,ElMessageBox } from 'element-plus'
/**
 * 处理请求返回结果后的消息提示
 * 
 */

// 返回成功的消息提示
export function openSuccessTip (msg){
    let successMsg = msg
    // 成功产生消息提示
    const openSuccess = () => {
        ElMessage({
            showClose: true,
            message: successMsg,
            type: 'success'
        })
    }
    openSuccess()
}

// 失败时的消息提示
export function openFailedTip(msg){
    let errorMsg = msg
    // 新建失败产生消息提示
    const openFailed = () => {
        ElMessage({
            showClose: true,
            message: errorMsg,
            type: 'error'
        })
    }
    openFailed()
}
// 接收请求后默认使用消息提示
export function useTips(successMsg="",data={}){
    if(data.code === 200){
        openSuccessTip(successMsg)
    }else{
        openFailedTip(data.message)
    }
}
// 全自定义的操作提示框
export function useConfirm(message, title, options) {
    return ElMessageBox.confirm(message, title, options)
}
// 一般时候的操作提示框
export function useSimpleConfirm(message){
    return useConfirm(message, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true
    })
}
// 警示框（只能点确定）
export function useWarningConfirm(message){
    return useConfirm(message, '警告提醒', {
        confirmButtonText: '我知道了',
        showCancelButton: false,
        showClose: false,
        type: 'warning',
    })
}