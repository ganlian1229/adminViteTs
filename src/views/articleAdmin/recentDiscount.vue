<template>
    <div class="article-admin content-page">
        <h1 class="page-title">近期优惠</h1>
        <p class="page-description">内容模块与局部组件示例。</p>
        <test></test>
    </div>
</template>
<script setup lang="ts">
import test from './components/test.vue';
/** 挂载前日志；无参数、无返回值；输出生命周期。 */
onBeforeMount(() => {
    console.log('beforeMount');
});
/** 挂载日志；无参数、无返回值；输出生命周期。 */
onMounted(() => {
    console.log('mounted');
});
</script>
<style lang="scss" scoped>
.article-admin {
    min-height: 240px;
}
</style>
