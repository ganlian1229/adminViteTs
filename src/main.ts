import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);
app.config.idPrefix = 'admin';
//使用自定义指令
import directive from '@/directive';
app.use(directive);
//全局注册elementIcon
import * as ElIcons from '@element-plus/icons-vue';
for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}

// import ElementPlus from 'element-plus'
// app.use(ElementPlus)
// 防止element-plus时 只使用组件 API 组件弹出没有样式
import 'element-plus/dist/index.css';
// global css
import '@/assets/css/index.scss';

import router from './router';
app.use(router);

// 使用pinia
import pinia from '@/store/store.js';
app.use(pinia);
console.log('app', app);

app.mount('#app');
