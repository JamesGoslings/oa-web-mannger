import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import mitt from 'mitt'
import router from '@/routers/permissions.js'
import pinia from '@/utils/pinia.js'

import vue3TreeOrg from 'vue3-tree-org';
import "vue3-tree-org/lib/vue3-tree-org.css";

import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'


const bus = mitt()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(vue3TreeOrg)

app.use(formCreate)
app.use(FcDesigner)

app.mount('#app')
app.config.globalProperties.$bus = bus