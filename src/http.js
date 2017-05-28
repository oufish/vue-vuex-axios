import axios from 'axios'
import Qs from 'qs';
import 'babel-polyfill';
import cookies from 'cookiesjs';
import router from './router';
// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            console.log(error.response)
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                   
                //    cookies({ LoginClick: null });
                    router.replace({
                        path: '/login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
    });

export default axios;