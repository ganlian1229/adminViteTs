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

import router from './router';
app.use(router);

// 使用pinia
import pinia from '@/store/store.js';
app.use(pinia);
console.log('app', app);

app.mount('#app');
