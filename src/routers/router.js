import {createRouter,createWebHashHistory} from 'vue-router'
import Login from '@/views/login.vue'

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
        }
    ]
})

export default router