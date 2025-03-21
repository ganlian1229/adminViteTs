import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError, CancelTokenSource } from 'axios';
import { ElLoading, ElMessage } from 'element-plus';
const router = useRouter();
// 请求头
// Axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";//FROM
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; //JSON
let baseURL = '';
// console.log('import.meta.env', import.meta.env);

const service = Axios.create({
    baseURL: baseURL, // url = base url + request url
    timeout: 5000 // request timeout
});

//loading变量
const LoadingInstance = {
    target: null,
    count: 0
};
//创建loading
function addLoading() {
    LoadingInstance.count++;
    if (LoadingInstance.count == 1) {
        LoadingInstance.target = ElLoading.service({
            lock: true,
            customClass: 'loading-box',
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(225, 225, 225, 0.5)'
        });
    }
}
//关闭loading
function closeLoading() {
    if (LoadingInstance.count > 0) LoadingInstance.count--;
    if (LoadingInstance.count == 0 && LoadingInstance.target) {
        LoadingInstance.target.close();
        LoadingInstance.target = null;
    }
}

// 存储待处理的请求队列
const requestQueue: AxiosRequestConfig[] = [];
// 并发请求计数器
let activeRequests = 0;
// 最大并发数
const MAXREQUEST = 3;
// 处理并发请求
function handlerActiveRequests() {
    activeRequests--;
    if (requestQueue.length > 0) {
        const queuedRequest = requestQueue.shift();
        if (queuedRequest) {
            activeRequests++;
            service(queuedRequest);
        }
    }
}

// Axios请求前
Axios.interceptors.request.use(
    (config: any) => {
        if (activeRequests >= MAXREQUEST) {
            // 如果当前正在执行的请求数量大于等于最大并发数，将请求添加到队列中等待执行
            return new Promise<AxiosRequestConfig>((resolve) => {
                requestQueue.push(config);
                const interval = setInterval(() => {
                    if (activeRequests < MAXREQUEST) {
                        clearInterval(interval);
                        const queuedRequest = requestQueue.shift();
                        if (queuedRequest) {
                            activeRequests++;
                            resolve(queuedRequest);
                        }
                    }
                }, 100);
            });
        } else {
            // 如果当前正在执行的请求数量小于最大并发数，则立即执行
            activeRequests++;
            return config;
        }
    },
    (err: AxiosError) => {
        ElMessage.error('参数错误');
        return Promise.reject(err);
    }
);

//Axios响应拦截器
Axios.interceptors.response.use(
    (response: AxiosResponse) => {
        handlerActiveRequests();
        return response;
    },
    (err: AxiosError) => {
        handlerActiveRequests();
        return Promise.reject(err);
    }
);

interface requestParams {
    hideLoading?: boolean;
    [key: string]: any;
}

//get请求方法
export function get(url: string, params: requestParams = {}) {
    //是否隐藏loading
    params.hideLoading ? delete params.hideLoading : addLoading();
    return new Promise((resolve, reject) => {
        service
            .get(url, {
                params: params
            })
            .then((res) => {
                resolve(res);
                // if (res.data.code == 200) {
                //     resolve(res.data);
                // } else if (res.data.code == 0) {
                //     //code等于0的公共操作（这里是跳转到登录）
                //     ElMessage.error(res.data.msg);
                //     router.replace({
                //         name: "login"
                //     })
                //     sessionStorage.clear();
                // } else {
                //     reject(res.data);
                //     ElMessage.error(res.data.msg);
                // }
            })
            .catch((err) => {
                console.log('err', err);
                reject(err.data);
            })
            .finally(() => {
                closeLoading();
            });
    });
}
//post请求方法
export function post(url: string, params: requestParams = {}) {
    //是否隐藏loading
    params.hideLoading ? delete params.hideLoading : addLoading();

    return new Promise((resolve, reject) => {
        service
            // .post(url, QS.stringify(params))//FROM 需要序列化params
            .post(url, params)
            .then((res) => {
                if (res.data.code == 200) {
                    resolve(res.data);
                } else if (res.data.code == 40001) {
                    //code等于0的公共操作（这里是跳转到登录）
                    ElMessage.error(res.data.msg);
                    router.replace({
                        name: 'login'
                    });
                    sessionStorage.clear();
                } else {
                    reject(res.data);
                    ElMessage.error(res.data.msg);
                }
            })
            .catch((err) => {
                ElMessage.error('出现错误，请联系管理员!');
                reject(err.data);
            })
            .finally(() => {
                closeLoading();
            });
    });
}
//文件上传方法
export function multiPost(url, FormData) {
    addLoading();
    FormData.append('managerId', sessionStorage.getItem('managerId'));
    FormData.append('token', sessionStorage.getItem('token'));
    return new Promise((resolve, reject) => {
        service
            .post(url, FormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.data.code == 200) {
                    resolve(res.data);
                } else if (res.data.code == 40001) {
                    //code等于0的公共操作（这里是跳转到登录）
                    ElMessage.error(res.data.msg);
                    router.replace({
                        name: 'login'
                    });
                    sessionStorage.clear();
                } else {
                    reject(res.data);
                    ElMessage.error(res.data.msg);
                }
            })
            .catch((err) => {
                ElMessage.error('出现错误，请联系管理员!');
                reject(err.data);
            })
            .finally(() => {
                closeLoading();
            });
    });
}
