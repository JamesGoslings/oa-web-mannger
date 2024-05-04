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
// 操作提示框
export function useConfirm(message, title, options) {
    return ElMessageBox.confirm(message, title, options)
}