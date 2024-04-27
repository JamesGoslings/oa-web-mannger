import { createApp } from 'vue'
import App from './App.vue'

// import router from './routers/router.js'
import router from '@/routers/permissions.js'
import pinia from '@/utils/pinia.js'

const app = createApp(App)
console.log('==================END=================>>>>>>>>>')
console.log(router.getRoutes())
console.log('==================END=================>>>>>>>>>')
app.use(router)
app.use(pinia)
app.mount('#app')