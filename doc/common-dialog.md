# 公共弹窗组件 commonDialog

- 组件位置：`src/componentsGlobal/commonDialog.vue`，使用 Vue 3 `<script setup lang="ts">` 和 Element Plus。
- 使用标签 `<commonDialog />`，属性和事件使用 camelCase；可自动导入，也可显式导入。
- 对外接口与 `commonDrawer` 一致：`v-model`、标题/正文/底部插槽，以及遵循关闭拦截的公开关闭方法。
- 正文通过 `elScrollbar` 滚动，短内容按内容撑开，长内容限制弹窗高度，标题及底部操作区不随正文滚动。

## 手动验证示例

`src/views/articleAdmin/articleUser/fileList.vue` 提供“打开弹窗验证”入口，可切换长短内容、自定义标题、底部插槽、全屏和关闭拦截。弹窗内可解除关闭拦截，支持测试 `closeDialog()`、标题插槽关闭、默认关闭按钮、遮罩及 Esc；页面与弹窗内显示最近一次生命周期事件。测试内容复用页面现有列表数据。

## 基本用法

```vue
<commonDialog
    ref="commonDialogRef"
    v-model="dialogVisible"
    title="详情"
    width="600px"
    :beforeClose="handleBeforeClose"
    @opened="handleOpened"
    @closed="handleClosed"
>
    <div>弹窗内容</div>
    <template #footer>
        <elButton @click="commonDialogRef?.closeDialog()">关闭</elButton>
    </template>
</commonDialog>
```

示例中的状态、组件引用和回调由调用方声明；脚本中使用 `ref` 声明 `commonDialogRef`，通过 `commonDialogRef.value?.closeDialog()` 关闭。

## 属性与事件

| 属性 | 默认值 | 用途 |
| --- | --- | --- |
| `modelValue` | `false` | 显示状态，通过 `v-model` 双向同步。 |
| `title` | `''` | 默认标题文字；自定义标题时仍用于无障碍标题。 |

- `update:modelValue`：内部弹窗显示状态更新时通知父组件，由 `v-model` 接收。
- 其余 Element Plus 弹窗属性和监听器通过 `$attrs`、`v-bind` 透传，例如 `width`、`top`、`alignCenter`、`fullscreen`、`appendToBody`、`destroyOnClose`、`draggable`、`beforeClose`、`@open`、`@opened`、`@close`、`@closed`。
- 对外使用 `v-model`，内部适配 Element Plus 的 `v-model`；无需 `$listeners` 或 `.sync`。

## 插槽

| 插槽 | 用途与参数 |
| --- | --- |
| 默认插槽 | 正文，放在 `elScrollbar` 滚动区域内。 |
| `title` | 自定义标题，转接 Element Plus 的 `header` 插槽，透传 `close`、`titleId`、`titleClass`。 |
| `footer` | 自定义底部操作区，转接 Element Plus 的 `footer` 插槽；未提供时不渲染底部区域。 |

## 公开方法与关闭流程

- `closeDialog()`：无参数、无返回值，通过内部 `handleClose()` 请求关闭；内部实例尚未挂载时不执行。
- `beforeClose(done)` 决定是否允许关闭：允许时调用 `done()`，阻止时不调用。关闭按钮、遮罩、Esc（未禁用时）和 `closeDialog()` 均遵循 Element Plus 的关闭流程。
- 底部按钮如需关闭拦截，应调用 `closeDialog()`；直接将父组件显示状态设为 `false` 不经过 `beforeClose`。

## 高度与样式

- 组件使用 `<style lang="scss" scoped>`，正文和底部内容保留样式隔离；Teleport 外壳布局通过限定于 `.common-dialog` 的 `:global` 选择器设置。
- 默认最大高度为 `calc(100vh - var(--el-dialog-margin-top, 15vh) * 2)`，随 Element Plus 的 `top` 调整；全屏模式使用 Element Plus 的零顶部边距，使最大高度为视口高度。`top` 应为可计算的 CSS 长度或百分比，避免设置过大导致正文可用高度不足。
- 使用 `min-height: 0` 和 `overflow: hidden` 限制内部主体，只由 `elScrollbar` 执行正文滚动，底部仅在提供 footer 插槽时占位。
