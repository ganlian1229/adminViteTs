<template>
    <div class="globalCom">
        <span ref="spanDom" v-bind="$attrs">动态添加的全局组件</span>
    </div>
</template>
<script setup lang="ts">
let spanDom = ref(null);

defineExpose({
    spanDom
});
</script>
<style lang="scss" scoped></style>
