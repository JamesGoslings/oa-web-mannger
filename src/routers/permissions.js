import {useUserStore} from '@/store/userStore'
import { usePathStore } from '@/store/pathStore'
import pinia from '@/utils/pinia'
import router from '@/routers/router'
import {userInfo} from '@/api/user.js'
import { isSpace } from '@/utils/stringUtil'

import Home from '@/views/Home.vue';
import ParentView from '@/components/ParentView.vue'

/**
 * 处理路由守卫
*/

router.beforeEach(async(to,from,next) => {
    // 转登录的路由直接放行
    if(to.path === '/login'){
        if(useUserStore().token){
            next('/home')
        }else next()
    }else{
        // 未获取权限信息就发请求
        if(!hasInfo()){
            await userInit()
        }
        let {menus} = useUserStore(pinia)
        if(menus.length < 1 || router.getRoutes().length <= 4){
            // 用于判断是否需要添加
            let pathStore = usePathStore(pinia)
            // 处理路由
            dealRouters(menus,'',pathStore.isChange)
            // 进行添加
            // if(!pathStore.isChange){
                console.log('添加了一次路由')
                menus.forEach(menu=>{
                    router.addRoute(menu)
                })
            // }
            let lastRou = { 
                path: '/:catchAll(.*)', // 使用参数匹配和正则表达式来捕获所有路径  
                component: ()=>import('@/views/404.vue')
            }
            router.addRoute(lastRou)
            pathStore.isChange = true
            useUserStore(pinia).menus = menus
            // 保证添加路由的异步化操作完成后再转到目标路由
            next(to.fullPath);
        }else{
            next()
        }
    }
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
    user.id = data.userId

    console.log('==========info=======')
    console.log(data)
    console.log('==========info=======')

}

// 将路径转成组件，路径不存在就是默认组件
async function loadModule(modulePath){
    try{
        const module = await import(`/src/views/${modulePath}.vue`)
        return module.default;
    } catch (error) {
        // 返回默认组件404
        return import('@/views/404.vue').then(m => m.default);
    }
}


// 处理从后端拿到的路由数组
function dealRouters(routers,parentPath,isChange){
    for (var route of routers) {
        // 处理路由中的path属性
        if(!isSpace(route.path)){
            if(route.path.substring(0,1) !== '/'){
                route.path = `/${route.path}`
            }
        }
        if(!isChange){
            route.path = `${parentPath}${route.path}`
        }
        // 处理组件
        if(route.component === 'Home'){
            route.component = Home
        }else if(route.component === 'ParentView'){
            route.component = ParentView
        }else if(typeof route.component === 'string'){
            // route.path = route.component
            route.component = loadModule(route.component)
        }
        // 有子路由就递归继续处理
        if(route.children != null && route.children.length > 0){
            route.children = dealRouters(route.children,route.path,isChange)
        }
    }
    return routers
}



// 返回最终处理完毕的路由对象
export default router