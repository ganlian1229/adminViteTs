<template>
    <header class="top-navbar">
        <div class="top-box">
            <div class="navbar-left">
                <button
                    class="menu-toggle"
                    :aria-label="isActive ? '展开导航' : '收起导航'"
                    :aria-expanded="!isActive"
                    @click="switchActFun"
                >
                    <el-icon :size="19"><component :is="isActive ? 'Expand' : 'Fold'" /></el-icon>
                </button>
                <span class="breadcrumb-root">工作空间</span><span class="breadcrumb-divider">/</span
                ><span class="breadcrumb-current">{{ route.meta.title }}</span>
            </div>
            <div class="navbar-right">
                <span class="workspace-name">模板预览</span><span class="avatar">A</span>
                <el-button link @click="logout">退出登录</el-button>
            </div>
        </div>
        <div v-if="isShowTags" class="tags-view-box"><tagsView /></div>
    </header>
</template>
<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import tagsView from './tagsView.vue';
/** 页面路由实例，用于退出后导航。 */
const router = useRouter();
/** 当前路由，提供面包屑名称。 */
const route = useRoute();
/** 通知布局更新导航状态。 */
const emits = defineEmits(['update:isActive']);
/** 布局控制的折叠与标签显示属性。 */
const { isActive, isShowTags } = defineProps({ isActive: { type: Boolean }, isShowTags: { type: Boolean } });
/** 切换导航；无参数、无返回值；发出 update:isActive。 */
function switchActFun() {
    emits('update:isActive', !isActive);
}
/** 退出登录；无参数、无返回值；确认后清除会话并跳转登录页。 */
function logout() {
    ElMessageBox.confirm('是否确认退出登录？', '退出登录', {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true
    })
        .then(() => {
            router.push({ name: 'Login' });
            sessionStorage.clear();
        })
        .catch(() => {});
}
</script>
<style lang="scss" scoped>
.top-navbar {
    position: fixed;
    top: 0;
    right: 8px;
    left: var(--sidebar-width);
    z-index: 1002;
    background: var(--app-frame);
    .top-box {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
        gap: 12px;
        .navbar-left {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
            .menu-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                flex-shrink: 0;
                border: 0;
                border-radius: 6px;
                background: transparent;
                color: var(--app-muted);
                cursor: pointer;
                &:hover {
                    background: #e2e8eb;
                    color: var(--app-ink);
                }
                &:focus-visible {
                    outline: 2px solid var(--app-accent);
                }
            }
            .breadcrumb-root {
                color: var(--app-muted);
                font-size: 13px;
                white-space: nowrap;
            }
            .breadcrumb-divider {
                color: #9aa6ac;
            }
            .breadcrumb-current {
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .navbar-right {
            display: flex;
            gap: 14px;
            align-items: center;
            flex-shrink: 0;
            .workspace-name {
                color: var(--app-muted);
                font-size: 12px;
            }
            .avatar {
                display: grid;
                place-items: center;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: #dfe7eb;
                font-size: 12px;
                font-weight: bold;
                color: #41545e;
            }
        }
    }
    .tags-view-box {
        height: 40px;
    }
}
@media (max-width: 640px) {
    .top-navbar {
        right: 0;
        .top-box {
            padding: 0 16px;
            box-sizing: border-box;
            .navbar-left {
                gap: 8px;
                .breadcrumb-root,
                .breadcrumb-divider {
                    display: none;
                }
            }
            .navbar-right {
                gap: 10px;
                .workspace-name {
                    display: none;
                }
            }
        }
    }
}
</style>
