<template>
    <el-container class="container-content">
        <topNavBar v-model:isActive="isActive" v-model:isShowTags="isShowTags"></topNavBar>
        <leftSidebar v-model:isActive="isActive"></leftSidebar>
        <el-container
            class="main-container"
            :class="{
                active: isActive,
                'show-tags': isShowTags
            }"
        >
            <el-scrollbar wrap-class="scrollbar-main-wrapper">
                <div class="body-content">
                    <router-view v-slot="{ Component, route }">
                        <keep-alive>
                            <component :is="Component" :key="route.fullPath" />
                        </keep-alive>
                    </router-view>
                </div>
            </el-scrollbar>
        </el-container>
    </el-container>
</template>
<script setup lang="ts">
import leftSidebar from './components/leftSidebar.vue';
import topNavBar from './components/topNavBar.vue';

//是否收起菜单 true 收起
const isActive = ref(false);
// 是否显示标签页
const isShowTags = ref(true);

onMounted(() => {});
</script>

<style lang="scss" scoped>
$bgimg: '@/assets/image/';
.container-content {
    .main-container {
        margin-left: 210px;
        position: relative;
        height: 100%;
        transition: margin-left 0.28s;
        padding-top: 50px;
        min-width: 1200px;
        &.active {
            margin-left: 54px;
        }
        &.show-tags {
            padding-top: 80px;
            :deep(.el-scrollbar) {
                height: calc(100vh - 80px);
            }
            .body-content {
                min-height: calc(100vh - 80px);
            }
        }

        :deep(.el-scrollbar) {
            width: 100%;
            height: calc(100vh - 50px);
            .scrollbar-main-wrapper {
                & > .el-scrollbar__view {
                    min-height: 100%;
                }
            }
        }
        .body-content {
            width: 100%;
            min-height: calc(100vh - 50px);
            padding: 20px;
            position: relative;
            background: #f2f4f7;
        }
    }
}
</style>
