/// <reference types="vite/client" />
export {};
declare global {
    //设置全局属性
    interface Window {
        [key: string]: any;
    }
}

declare module '*.vue' {
    import { DefineComponent } from 'vue';
    // eslint-disable-next-line
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
