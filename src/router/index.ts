import { createRouter, createWebHashHistory } from 'vue-router';
import dynamicRouter from '@/router/dynamicRouter';
import { addRouter, removeRouter } from '@/utils';
import routes from './routes';
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

let isRefresh = sessionStorage.isLogin ? true : false; //是否是刷新
// 判断路由是否需要登录
router.beforeEach((to, from, next) => {
    //使用pinia（不能在外面使用）
    // let mainStoreObj = mainStore();
    // console.log('mainStoreObj', mainStoreObj);
    // console.log(to);
    if (to.name == 'login') {
        //当前页面跳转到登录页
        next();
        removeRouter(dynamicRouter);
        sessionStorage.clear();
    } else {
        if (to.matched.length == 0 && !isRefresh) {
            next('/login');
        } else {
            if (isRefresh) {
                //页面刷新走这里重新添加动态路由
                addRouter(dynamicRouter);
                isRefresh = false;
                next({ ...to, replace: true });
            } else {
                next();
            }
        }
    }
});

export default router;
