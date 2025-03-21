// 定义一个接口来描述 api 对象的结构
interface ApiModule {
    [key: string]: any;
}

const api: ApiModule = {};
const modules = import.meta.glob('../api/*.ts', { eager: true }) as any;
Object.entries(modules).forEach(([fileName, mod]: [string, any]) => {
    // 驼峰命名
    console.log('fileName', fileName);
    console.log('mod', mod);
    const moduleName = fileName
        ?.split('/')
        ?.pop()
        ?.replace(/\.\w+$/, '');
    console.log('moduleName', moduleName);
    api[moduleName] = mod;
});

// 导出推断后的类型
export type InferredApiModule = typeof api;
export default api;
