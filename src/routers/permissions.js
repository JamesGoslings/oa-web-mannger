import {useUserStore} from '@/store/userStore'
import pinia from '@/utils/pinia'
import router from '@/routers/router'
import {userInfo} from '@/api/user.js'

import Home from '@/views/Home.vue';
import ParentView from '@/components/ParentView.vue'

/**
 * 处理路由守卫
*/


router.beforeEach(async(to,from,next) => {
    console.log('===========PATH==========')
    console.log(to)
    console.log(to.path)
    console.log('===========PATH==========')
    console.log(useUserStore().name == '')
    // 转登录的路由直接放行
    if(to.path === '/login'){
        next()
    }else{
        // 未获取权限信息就发请求
        if(!hasInfo()){
            await userInit()
        }
        let {menus} = useUserStore(pinia)

        dealRouters(menus)
        next()
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

    console.log('==========info=======')
    console.log(data)
    console.log('==========info=======')

}

// 将路径转成组件，路径不存在就是默认组件
async function loadModule(modulePath){
    try {
        const module = await import(`@/views/${modulePath}.vue`);
        return module.default;
    } catch (error) {
        // 返回默认组件404
        return import('@/views/404.vue').then(m => m.default);
    }
}


// 处理从后端拿到的路由数组
function dealRouters(routers){
    for (var route of routers) {
        // 处理组件
        if(route.component === 'Home'){
            route.component = Home
        }else if(route.component === 'ParentView'){
            route.component = ParentView
        }else{
            route.component = loadModule(route.component)
        }
        // 有子路由就递归继续处理
        if(route.children != null && route.children.length > 0){
            route.children = dealRouters(route.children)
        }
        // 处理路由中的path属性
        if(route.path.substring(0,1) !== '/'){
            route.path = `/${route.path}`
        }
        console.log('=====================>>')
        console.log(route)
        console.log('<<=====================')
        router.addRoute(route)
    }
    return routers
}



// 返回最终处理完毕的路由对象
export default router
