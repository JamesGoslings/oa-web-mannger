import {createRouter,createWebHashHistory} from 'vue-router'

// 直接声明出必有的路由
let routes = [
    {
        path: '/login',
        // component:Login
        component:()=>import('@/views/Login.vue')
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        component:()=>import('@/views/Home.vue')
    }
] 

let router = createRouter({
    history:createWebHashHistory(),
    routes:routes
})
// 限权处理
// router.beforeEach(routerBeforeEachFun)
export default router
