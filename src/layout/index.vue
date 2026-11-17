<template>
    <el-container class="workspace" :class="{ 'is-collapsed': isActive, 'is-tagged': isShowTags }">
        <topNavBar v-model:isActive="isActive" v-model:isShowTags="isShowTags" />
        <leftSidebar v-model:isActive="isActive" />
        <button v-if="!isActive" class="menu-mask" aria-label="关闭导航" @click="isActive = true"></button>
        <el-container class="main-container">
            <el-scrollbar class="main-scrollbar" wrapClass="scrollbar-main-wrapper">
                <div class="body-content">
                    <router-view v-slot="{ Component, route }">
                        <keep-alive><component :is="Component" :key="route.fullPath" /></keep-alive>
                    </router-view>
                </div>
            </el-scrollbar>
        </el-container>
    </el-container>
</template>
<script setup lang="ts">
import leftSidebar from './components/leftSidebar.vue';
import topNavBar from './components/topNavBar.vue';
/** 导航折叠状态；窄屏首次进入时折叠。 */
const isActive = ref(window.innerWidth <= 1100);
/** 是否显示访问标签页。 */
const isShowTags = ref(true);
/** 窄屏媒体查询，用于跨断点时收起侧栏。 */
const compactQuery = window.matchMedia('(max-width: 1100px)');
/** 响应断点切换；无参数、无返回值；同步导航折叠状态。 */
function syncNavigation() {
    isActive.value = compactQuery.matches;
}
/** 注册断点监听；无参数、无返回值；绑定媒体查询事件。 */
onMounted(() => {
    compactQuery.addEventListener('change', syncNavigation);
});
/** 清理断点监听；无参数、无返回值；移除媒体查询事件。 */
onUnmounted(() => {
    compactQuery.removeEventListener('change', syncNavigation);
});
/** 当前页面信息，用于窄屏导航后收起菜单。 */
const route = useRoute();
/** 监听页面切换；无参数、无返回值；窄屏自动收起导航。 */
watch(
    () => route.fullPath,
    () => {
        if (compactQuery.matches) isActive.value = true;
    }
);
</script>
<style lang="scss" scoped>
.workspace {
    --sidebar-width: 228px;
    --header-height: 56px;
    --tags-height: 0px;
    min-height: 100dvh;
    background: var(--app-frame);
    &.is-collapsed {
        --sidebar-width: 64px;
    }
    &.is-tagged {
        --tags-height: 40px;
    }
    .menu-mask {
        display: none;
    }
    .main-container {
        margin: calc(var(--header-height) + var(--tags-height)) 8px 8px var(--sidebar-width);
        min-width: 0;
        height: calc(100dvh - var(--header-height) - var(--tags-height) - 8px);
        border: 1px solid var(--app-border);
        border-radius: 16px;
        overflow: hidden;
        background: var(--app-surface);
        .main-scrollbar {
            width: 100%;
            .body-content {
                padding: 28px;
                box-sizing: border-box;
                min-width: 0;
            }
        }
    }
}
@media (max-width: 1100px) {
    .workspace {
        --sidebar-width: 0px;
        &.is-collapsed {
            --sidebar-width: 0px;
        }
        .menu-mask {
            display: block;
            position: fixed;
            inset: 0;
            border: 0;
            background: rgb(20 30 36 / 28%);
            z-index: 1003;
        }
        .main-container {
            margin-left: 8px;
        }
    }
}
@media (max-width: 640px) {
    .workspace {
        .main-container {
            margin: calc(var(--header-height) + var(--tags-height)) 0 0;
            border-radius: 0;
            height: calc(100dvh - var(--header-height) - var(--tags-height));
            .main-scrollbar {
                .body-content {
                    padding: 20px 16px;
                    box-sizing: border-box;
                }
            }
        }
    }
}
</style>
