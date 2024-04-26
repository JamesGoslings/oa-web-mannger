import axios from 'axios'
import { getToken } from './auth';

axios.defaults.withCredentials = true;
const instance = axios.create({
    // baseURL:'http://localhost:8800/'
    baseURL:'/devApi'
})

//添加请求拦截
instance.interceptors.request.use(
    config=>{
        // 登录请求直接放行
        if(config.url === '/admin/system/index/login'){
            return config
        }

        // 其他请求在请求头设置token
        // config.headers.set('token',localStorage.getItem('token'))
        config.headers.set('token',getToken())

        return config
    },
    error=>{
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response=>{
        let {data} = response
        if(data.code === 200){
            return Promise.resolve(data)
        }else{
            return Promise.reject(data)
        }
    },
    error=>{
        return Promise.reject(error)
    }
)

export default instance