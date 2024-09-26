<template>
    <el-config-provider :locale="zhCn">
        <router-view />
    </el-config-provider>
</template>
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';
</script>
<style lang="scss">
// 全局样式
@import '@/assets/css/index.scss';
</style>
