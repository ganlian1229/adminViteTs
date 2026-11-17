# 公共抽屉组件 commonDrawer

- 组件位置：`src/componentsGlobal/commonDrawer.vue`，使用 Vue 3 `<script setup lang="ts">` 和 Element Plus。
- 使用标签 `<commonDrawer />`，属性、事件名称使用 camelCase；可自动导入，也可显式导入。
- 内容区域使用 Element Plus 的 `elScrollbar` 滚动，底部操作区保留在抽屉主体底部；组件使用 scoped SCSS 样式。

- 抽屉主体通过 flex 占据标题之外的剩余高度，设置 `min-height: 0` 和 `overflow: hidden`，只由内部 `elScrollbar` 滚动。Teleport 渲染的抽屉根节点不带本组件的 scoped 标记，主体样式使用限定于 `.common-drawer` 的 `:global` 选择器；正文与底部容器继续使用 scoped 隔离。

## 手动验证示例

`src/views/articleAdmin/articleUser/fileList.vue` 提供“打开抽屉验证”入口，可切换长短内容、自定义标题、底部插槽和关闭拦截。正文复用页面现有测试数据，可验证 `elScrollbar` 滚动、底部操作区、`v-model:visible`、关闭方法及事件透传。

## 基本用法

父组件声明布尔状态 `drawerVisible`，通过 Vue 3 的 `v-model:visible` 控制显示；原 Vue 2 的 `:visible.sync` 写法需要替换。

```vue
<commonDrawer
    ref="commonDrawerRef"
    v-model:visible="drawerVisible"
    title="详情"
    size="600px"
    :beforeClose="handleBeforeClose"
    @opened="handleOpened"
    @closed="handleClosed"
>
    <div>抽屉内容</div>
    <template #footer>
        <elButton @click="commonDrawerRef?.closeDrawer()">关闭</elButton>
    </template>
</commonDrawer>
```

示例中的状态、组件引用和事件方法由调用方声明；脚本中应通过 `ref` 声明 `commonDrawerRef`，以 `commonDrawerRef.value?.closeDrawer()` 调用关闭方法。

## 属性与事件

| 属性 | 默认值 | 用途 |
| --- | --- | --- |
| `visible` | `false` | 抽屉显示状态，使用 `v-model:visible` 双向绑定。 |
| `title` | `''` | 标题文字；自定义标题插槽覆盖显示内容时仍用于无障碍标题。 |

- `update:visible`：内部 Element Plus 抽屉更新显示状态时同步通知父组件，由 `v-model:visible` 接收。
- 其他 Element Plus 抽屉属性和监听器通过 `$attrs`、`v-bind` 透传，例如 `size`、`direction`、`appendToBody`、`destroyOnClose`、`beforeClose`、`@open`、`@opened`、`@close`、`@closed`；Vue 3 不再使用 `$listeners`。
- 对外显示接口为 `v-model:visible`，内部适配 Element Plus 的 `v-model`。

## 插槽

| 插槽 | 用途与参数 |
| --- | --- |
| 默认插槽 | 抽屉正文，放在 `elScrollbar` 滚动区域内；内边距由内部视图容器提供。 |
| `title` | 自定义标题，内部使用 Element Plus 的 `header` 插槽；透传 `close`、`titleId`、`titleClass` 作用域参数。 |
| `footer` | 自定义底部操作内容，放在组件自己的底部容器中；未提供时不显示边框和内边距。 |

提供 `title` 插槽时不需要使用已弃用的 Element Plus `title` 插槽；组件会将其转接到 `header`。可以通过传入 `withHeader` 控制抽屉头部显隐。

## 公开方法与关闭流程

- `closeDrawer()`：无参数、无返回值，通过内部抽屉实例的 `handleClose()` 请求关闭，保留关闭动画及事件流程；内部实例尚未挂载时不执行。
- 提供 `beforeClose` 时，钩子接收 Element Plus 提供的 `done` 回调；允许关闭时调用 `done()`，取消关闭时不调用。`closeDrawer()`、关闭按钮等遵循该钩子，不会在调用钩子后强制关闭。
- 父组件直接将 `drawerVisible` 设为 `false` 是外部状态控制，不会经过 `beforeClose`；需要关闭确认时应调用 `closeDrawer()`。
