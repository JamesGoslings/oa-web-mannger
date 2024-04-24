import axios from 'axios'

axios.defaults.withCredentials = true;
const instance = axios.create({
    // baseURL:'http://localhost:8800/'
    baseURL:'/devApi'

})

//添加请求拦截
instance.interceptors.request.use(
    config=>{
        return config
    },
    error=>{
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response=>{
        return response
    },
    error=>{
        return Promise.reject(error)
    }
)

export default instance