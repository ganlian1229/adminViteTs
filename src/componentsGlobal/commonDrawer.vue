<template>
    <elDrawer ref="drawerRef" class="common-drawer" v-bind="$attrs" v-model="isVisible" :title="props.title">
        <template v-if="$slots.title" #header="scope">
            <slot name="title" v-bind="scope"></slot>
        </template>
        <elScrollbar class="drawer-content" wrapClass="content-wrap" viewClass="content-view">
            <slot></slot>
        </elScrollbar>
        <div class="drawer-footer" :class="{ 'is-empty': !$slots.footer }">
            <slot name="footer"></slot>
        </div>
    </elDrawer>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { ElDrawer as elDrawer, ElScrollbar as elScrollbar } from 'element-plus';
import 'element-plus/es/components/drawer/style/css';
import 'element-plus/es/components/scrollbar/style/css';

defineOptions({ name: 'commonDrawer', inheritAttrs: false });

/** 抽屉标题属性；提供 title 插槽时仍用于抽屉的无障碍标题。 */
const props = defineProps({
    /** 默认标题文字。 */
    title: { type: String, default: '' }
});

/** 抽屉显示状态，通过 v-model:visible 与父组件同步。 */
const isVisible = defineModel<boolean>('visible', { default: false });
/** 内部 Element Plus 抽屉实例。 */
const drawerRef = shallowRef<InstanceType<typeof elDrawer>>();

/**
 * 请求关闭抽屉，遵循 Element Plus 的关闭流程。
 * @returns 无返回值。
 * @remarks 无参数；调用内部 handleClose，由其执行 beforeClose；钩子允许关闭后同步 visible 并触发关闭事件。
 */
function closeDrawer(): void {
    drawerRef.value?.handleClose();
}

// 保留父组件通过组件 ref 调用 closeDrawer 的接口。
defineExpose({ closeDrawer });
</script>

<style lang="scss" scoped>
// elDrawer 的根节点由 Teleport 渲染，不带当前组件的 scoped 标记；仅对此组件的抽屉主体解除选择器隔离。
:global(.common-drawer .el-drawer__body) {
    padding: 0 !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    min-height: 0;
    overflow: hidden;
}

.drawer-content {
    flex: 1 1 auto;
    height: 0;
    min-height: 0;

    :deep(.content-wrap) {
        .content-view {
            padding: 1px 20px;
            box-sizing: border-box;
        }
    }
}

.drawer-footer {
    flex-shrink: 0;
    margin-top: 10px;
    padding: 20px;
    box-sizing: border-box;
    border-top: 1px solid #e5e5e5;
    text-align: right;
    background-color: #ffffff;
    z-index: 10;

    &.is-empty {
        border-top: none;
        padding: 0;
        box-sizing: border-box;
    }
}
</style>
