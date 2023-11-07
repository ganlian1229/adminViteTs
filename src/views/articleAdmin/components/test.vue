<template>
    <div class="test">test</div>
</template>
<script setup lang="ts">
onBeforeMount(() => {
    console.log('test beforeMount');
});
onMounted(() => {
    console.log('test mounted');
});
</script>
<style lang="scss" scoped></style>
