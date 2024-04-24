import {createRouter,createWebHashHistory} from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path: '/login',
            component:Login
        },
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component:Home
        }
    ]
})

export default router