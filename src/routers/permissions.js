import {useUserStore} from '@/store/userStore'
import pinia from '@/utils/pinia'
import router from '@/routers/router'
import {userInfo} from '@/api/user.js'
/**
 * 处理路由守卫
*/

router.beforeEach(async(to,from,next) => {
    console.log('===========PATH==========')
    console.log(to)
    console.log(to.path)
    console.log('===========PATH==========')
    console.log(useUserStore().name == '')
    takeRouters()
    // 转登录的路由直接放行
    if(to.path === '/login'){
        next()
    }else{
        // 未获取权限信息就发请求
        if(!hasInfo()){
            await userInit()
        }
        
    }
    next()
})

// 判断是否已经发起过获取权限等信息的请求
function hasInfo(){
    return (useUserStore(pinia).name != '' && useUserStore(pinia).name != null)
}

// 加载用户的权限信息和基础信息到pinia
const userInit = async()=>{
    let {data} = await userInfo()
    // 将权限信息存入pinia

    let user = useUserStore()
    user.buttons = data.buttons
    user.name = data.name
    user.menus = data.routers

    console.log('==========info=======')
    console.log(data)
    console.log('==========info=======')

}

// 处理从后端拿到的路由数组
function takeRouters(){
    let sysUser = useUserStore(pinia)
    console.log('==========ROUTER=============')
    console.log(sysUser.menus)
    console.log('==========ROUTER=============')
}



// 返回最终处理完毕的路由对象
export default router
