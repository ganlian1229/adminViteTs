# Class 与 SCSS 规范

## Class 命名
- class 名称必须简洁、语义明确。
- class 统一使用 kebab-case 命名方式，例如：product-card、user-info、shop-content
- 禁止使用 BEM 命名方式，包括双下划线和双连字符。
- 状态类统一使用 is- 前缀，并使用 kebab-case 命名方式，例如：is-active、is-disabled、is-hidden
- 状态类必须使用 SCSS 嵌套写法：&.is-active
- 禁止直接在模板中使用不符合命名规范的 class。
- class 名称不得过度冗长，必须能够清晰表达元素或状态含义。
- 子元素 class 禁止完全重复父级 class 名作为前缀，例如：父级是 .pro-no-data 子集是 .pro-no-data-xxx 是禁止的，可以使用 .no-data-xxx 或者使用 .data-xxx
## 选择器层级
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
## 选择器书写顺序
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
## 盒模型
- 任何包含 padding 的选择器，必须同时声明：
box-sizing: border-box;
- padding 和 box-sizing 必须写在同一个选择器中。
- 禁止使用通配符统一设置 box-sizing。
正确示例：
.product-card {
  padding: 16px;
  box-sizing: border-box;
}
## 字体粗细
- 所有 font-weight 数值大于或等于 300 时，必须替换为：
font-weight: bold;
- 禁止使用 font-weight: 300、400、500、600、700 等数值。
- font-weight: 100 和 font-weight: 200 可以根据设计要求保留。
- 除非设计明确要求，否则不要使用其他数字形式的 font-weight。
