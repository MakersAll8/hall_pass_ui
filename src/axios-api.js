import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3001'
});

instance.interceptors.request.use(function (config){
    let token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = token;
    }
    // do something before sending request
    return config;
})

instance.interceptors.response.use(function (response){
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // update expires every time I received a request back
    localStorage.setItem('expires', (new Date().getTime()+3600000).toString())
    return response;
})
export default instance;
