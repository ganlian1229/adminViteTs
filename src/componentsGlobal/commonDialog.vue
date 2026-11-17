<template>
    <elDialog ref="dialogRef" class="common-dialog" v-bind="$attrs" v-model="isVisible" :title="props.title">
        <template v-if="$slots.title" #header="scope">
            <slot name="title" v-bind="scope"></slot>
        </template>
        <elScrollbar class="dialog-content" wrapClass="content-wrap" viewClass="content-view">
            <slot></slot>
        </elScrollbar>
        <template v-if="$slots.footer" #footer>
            <div class="dialog-footer">
                <slot name="footer"></slot>
            </div>
        </template>
    </elDialog>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { ElDialog as elDialog, ElScrollbar as elScrollbar } from 'element-plus';
import 'element-plus/es/components/dialog/style/css';
import 'element-plus/es/components/scrollbar/style/css';

defineOptions({ name: 'commonDialog', inheritAttrs: false });

/** 弹窗标题属性；自定义标题时仍提供无障碍标题。 */
const props = defineProps({
    /** 默认标题文字。 */
    title: { type: String, default: '' }
});

/** 弹窗显示状态，通过 v-model 与父组件同步。 */
const isVisible = defineModel<boolean>({ default: false });
/** 内部 Element Plus 弹窗实例。 */
const dialogRef = shallowRef<InstanceType<typeof elDialog>>();

/**
 * 请求关闭弹窗，遵循 Element Plus 的关闭流程。
 * @returns 无返回值。
 * @remarks 无参数；调用内部 handleClose 执行 beforeClose，允许关闭后同步 modelValue 并触发关闭事件。
 */
function closeDialog(): void {
    dialogRef.value?.handleClose();
}

// 父组件可通过组件 ref 请求关闭，保留关闭拦截。
defineExpose({ closeDialog });
</script>

<style lang="scss" scoped>
// Teleport 渲染的弹窗外壳不带当前组件的 scoped 标记，仅在 common-dialog 范围内适配内部布局。
:global(.common-dialog.el-dialog) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - var(--el-dialog-margin-top, 15vh) * 2);
    overflow: hidden;
}

:global(.common-dialog .el-dialog__header),
:global(.common-dialog .el-dialog__footer) {
    flex-shrink: 0;
}

:global(.common-dialog .el-dialog__body) {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
}

.dialog-content {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: auto;
    min-height: 0;

    :deep(.content-wrap) {
        flex: 1 1 auto;
        height: auto;
        min-height: 0;

        .content-view {
            padding: 1px 0;
            box-sizing: border-box;
        }
    }
}

.dialog-footer {
    text-align: inherit;
}
</style>
