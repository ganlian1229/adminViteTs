import { RouteRecordRaw } from 'vue-router';

let routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/common/login.vue'),
        meta: {
            title: '登录'
        }
    }
];

export default routes;
