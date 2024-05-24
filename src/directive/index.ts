const modules = import.meta.glob('./group/*.ts', { eager: true }) as any;
export default function setupDirective(app) {
    console.log('modules', modules);
    Object.entries(modules).forEach(([fileName, mod]: [string, any]) => {
        // 驼峰命名
        // console.log('fileName', fileName);
        // console.log('mod', mod);
        const moduleName = fileName
            ?.split('/')
            ?.pop()
            ?.replace(/\.\w+$/, '');
        // console.log('moduleName', moduleName);
        app.directive(moduleName, mod.default);
    });
}
