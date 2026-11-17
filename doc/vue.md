# Vue 组件规范

## 组件与脚本
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
## Style 标签
- Vue 组件样式统一使用：<style lang="scss" scoped>
- 新增组件样式时必须添加 scoped。
- 如果新增或修改了 scoped，必须在最终回复中明确提示：已为该组件添加 scoped 样式隔离。
- 除非用户明确要求，否则不得移除已有的 scoped。
