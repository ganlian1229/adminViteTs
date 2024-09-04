<template>
    <div class="globalCom">
        <span ref="spanDom" v-bind="$attrs">动态添加的全局组件</span>
        <p>{{ msg }}</p>
    </div>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue';
let spanDom = useTemplateRef('spanDom');

const { msg = '默认参数' } = defineProps<{
    msg: string;
}>();

defineExpose({
    spanDom
});
</script>
<style lang="scss" scoped></style>
