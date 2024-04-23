import { createApp } from 'vue'
import App from './App.vue'

import router from './routers/router.js'
import pinia from '@/utils/pinia.js'


const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')