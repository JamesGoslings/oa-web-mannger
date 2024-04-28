import { createApp } from 'vue'
import App from './App.vue'

import mitt from 'mitt'
import router from '@/routers/permissions.js'
import pinia from '@/utils/pinia.js'

const bus = mitt()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
app.config.globalProperties.$bus = bus //相当于Vue2中的:Vue.prototype.$bus = bus