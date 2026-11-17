# 项目约定与目录说明

操作本仓库前检查 `git config --local --get core.ignorecase`；若结果不是 `false`，执行 `git config --local core.ignorecase false`。此配置仅在本地 `.git/config` 生效，新克隆仓库需重新设置，不能通过提交 `.git/config` 共享。

## 项目目录说明

- `doc/`：分类保存项目约定、开发规范及公共组件使用说明，阅读入口为根目录 `AGENTS.md`。
- `src/main.ts`：应用入口，注册路由、Pinia、全局指令和 Element Plus 图标。
- `src/App.vue`：根组件，提供路由出口并引入全局样式。
- `src/api/`：接口模块及 Axios 请求封装；`index.ts` 汇总接口模块。
- `src/assets/`：图片和样式资源；`css/` 存放全局样式、变量及过渡样式。
- `src/componentsGlobal/`：可自动导入的公共组件，其中 `test/` 存放示例组件。
- `src/directive/`：自定义指令的注册入口；`group/` 存放各指令实现。
- `src/layout/`：后台页面布局；`components/` 存放顶部导航、侧边栏和标签页等布局组件。
- `src/router/`：路由实例、基础路由和动态路由配置。
- `src/store/`：Pinia 实例及页面状态模块。
- `src/utils/`：通用工具函数和事件通信工具。
- `src/views/`：页面组件目录。
- `types/`：全局 TypeScript 类型声明。
- `index.html`、`vite.config.ts`：页面入口和 Vite 配置；`vite-plugin-api-types.ts` 根据 `src/api/` 生成接口类型声明。
- `.env.dev`、`.env.pro`：环境变量文件；`package.json`、`tsconfig*.json` 分别配置依赖脚本和 TypeScript。
