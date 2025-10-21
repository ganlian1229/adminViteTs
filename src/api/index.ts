import type { ApiModules } from '../api-types.d';

const moduleFiles = import.meta.glob('./*.ts', { eager: true });

// 创建 API 对象，使用类型断言来获得准确的类型提示
const api = {} as ApiModules;

Object.entries(moduleFiles).forEach(([filePath, moduleExports]) => {
    const fileName = filePath.split('/').pop();
    if (!fileName) return;

    const moduleName = fileName.replace('.ts', '') as keyof ApiModules;

    if (fileName.endsWith('.d.ts')) return;

    // 使用类型断言，让 TypeScript 知道这个赋值是正确的
    (api as any)[moduleName] = moduleExports;
});

// 导出类型和 API 对象
export type { ApiModules as ApiType };
export default api as ApiModules;
