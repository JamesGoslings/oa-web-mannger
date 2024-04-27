import {createRouter,createWebHashHistory} from 'vue-router'

const not = ()=>import('@/views/404.vue')
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
    // {
    //     path: '*',
    //     component:()=>import('@/views/404.vue')
    // },
    {
        path: '/home',
        component:()=>import('@/views/Home.vue')
        // ,
        // children:[
        //     {
        //         path: '/sysUser',
        //         component: ()=> import('@/views/system/sysUser/list.vue')
        //     }
        // ]
    }
]

let router = createRouter({
    history:createWebHashHistory(),
    routes:routes
})


export default router
