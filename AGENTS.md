# 项目规则

操作本仓库前检查 `git config --local --get core.ignorecase`；若结果不是 `false`，执行 `git config --local core.ignorecase false`。此配置仅在本地 `.git/config` 生效，新克隆仓库需重新设置，不能通过提交 `.git/config` 共享。

## 项目目录说明

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

# 项目规则
一、基础规范
- 如果使用模拟数据，禁止新增模拟数据变量，例如：list:[] 这个list需要模拟数据  直接把模拟数据赋值给list
- 如果服务端定义的字段与本地不一致，禁止做映射，直接修改为使用服务端字段。
- 不确定的内容必须先查看现有代码、配置或资料，不要凭经验猜测。
- 修改代码前，应先检查相关文件、模板结构、已有样式和业务逻辑。
- 只修改用户要求范围内的内容，不得随意改动无关代码。
- 需要说明验证结果；未实际验证的内容必须明确说明未验证。
- 如果项目使用了UI组件库，输入校验需要使用UI库的表单校验。
- 组件中使用ref的时候ref的值需要再最后面添加Ref，例如ref='abc',改为ref='abcRef'。
二、Vue 组件规范
- 所有 Vue 组件样式必须使用 SCSS。
- 自定义组件标签必须以小写字母开头，并使用 camelCase 命名。
- 自定义组件的使用方式和组件 name 必须保持一致。
- 所有 Vue 组件中的 字段、方法、函数方法都必须添加注释。
- 函数注释必须说明：
   - 函数用途
   - 参数含义
   - 返回值
   - 关键副作用
- 不得在未检查组件现有逻辑的情况下重写组件结构或业务方法。
- 组件传参使用 camelCase 不要使用kebab-case，例如： <realNameVerification :cert-no="form.legalIdCard"  @face-result="handleFaceResult"  /> 是错误的  因该 <realNameVerification :certNo="form.legalIdCard"  @faceResult="handleFaceResult"  />
三、Style 标签规范
- Vue 组件样式统一使用：<style lang="scss" scoped>
- 新增组件样式时必须添加 scoped。
- 如果新增或修改了 scoped，必须在最终回复中明确提示：已为该组件添加 scoped 样式隔离。
- 除非用户明确要求，否则不得移除已有的 scoped。
四、Class 命名规范
- class 名称必须简洁、语义明确。
- class 统一使用 kebab-case 命名方式，例如：product-card、user-info、shop-content
- 禁止使用 BEM 命名方式，包括双下划线和双连字符。
- 状态类统一使用 is- 前缀，并使用 kebab-case 命名方式，例如：is-active、is-disabled、is-hidden
- 状态类必须使用 SCSS 嵌套写法：&.is-active
- 禁止直接在模板中使用不符合命名规范的 class。
- class 名称不得过度冗长，必须能够清晰表达元素或状态含义。
- 子元素 class 禁止完全重复父级 class 名作为前缀，例如：父级是 .pro-no-data 子集是 .pro-no-data-xxx 是禁止的，可以使用 .no-data-xxx 或者使用 .data-xxx 
五、SCSS 选择器规范
- 样式中禁止直接为 HTML 标签添加样式，例如 div、span、p、button 等。
- 样式应优先使用 class 选择器实现。
- 禁止使用通配符选择器。
- SCSS 一级选择器可以根据页面模块或组件区域独立书写，无需统一嵌套在组件最外层 class 中。
- 从二级选择器开始，选择器的嵌套关系必须严格对应 Vue 模板中的真实 DOM 父子层级。
- 每个子元素的 class 必须嵌套在其真实父级 class 内部。
- 禁止仅按照页面模块或功能模块进行选择器平铺。
- 兄弟元素必须保持同级嵌套。
- 禁止为 Vue 模板中不存在的 DOM 层级创建虚假嵌套关系。
- 状态类必须使用 &.is-active 的嵌套形式。
- 伪元素必须使用 &::after、&::before 等嵌套形式。
- 状态类和伪元素不得脱离所属父级 class 单独书写。
- SCSS 最大嵌套层级为 7 级。
- 超过 7 级时，必须拆分选择器，禁止继续增加嵌套层级。
- @keyframes 必须定义在最外层，禁止嵌套在组件选择器内部。
六、SCSS 选择器书写顺序
同一个父级 class 内部必须严格按照以下顺序书写：
- 当前父级自身样式；
- 当前父级的状态类；
- 当前父级的伪元素或伪类；
- 子元素样式；
- 子元素的状态类和伪元素。
状态类必须紧跟在父级自身样式之后，并且必须放在所有子元素选择器之前。
正确示例：
.product-card {
  padding: 16px;
  box-sizing: border-box;
  color: #333;
  &.is-active {
    color: #409eff;
  }
  &.is-disabled {
    opacity: 0.6;
  }
  &::after {
    content: '';
  }
  .title {
    font-size: 16px;
    &.is-active {
      color: #409eff;
    }
    &::after {
      content: '';
    }
  }
  .content {
    color: #666;
  }
}
禁止示例：
.product-card {
  .title {
    font-size: 16px;
  }
  &.is-active {
    color: #409eff;
  }
}
七、盒模型规范
- 任何包含 padding 的选择器，必须同时声明：
box-sizing: border-box;
- padding 和 box-sizing 必须写在同一个选择器中。
- 禁止使用通配符统一设置 box-sizing。
正确示例：
.product-card {
  padding: 16px;
  box-sizing: border-box;
}
八、字体粗细规范
- 所有 font-weight 数值大于或等于 300 时，必须替换为：
font-weight: bold;
- 禁止使用 font-weight: 300、400、500、600、700 等数值。
- font-weight: 100 和 font-weight: 200 可以根据设计要求保留。
- 除非设计明确要求，否则不要使用其他数字形式的 font-weight。

## 模块化开发

- 功能开发应按职责合理拆分模块，避免将页面结构、组件、接口调用、状态处理和业务逻辑全部堆积在同一个文件中。
- 页面文件以功能编排和模块组装为主；可独立维护、复用或具有明确职责的代码，应封装到对应的组件、服务或工具模块中。
- 模块拆分应服务于清晰性和可维护性，不为简单的一次性逻辑进行无意义的过度拆分。
