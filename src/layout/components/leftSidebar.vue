<template>
    <aside class="sidebar-container" :class="{ 'is-collapsed': isActive }">
        <router-link
            class="brand"
            :class="{ 'is-collapsed': isActive }"
            to="/main/index"
            aria-label="Admin Vite TS 首页"
        >
            <span class="brand-mark">a<span class="brand-dot"></span></span>
            <span v-if="!isActive" class="brand-info"
                ><strong class="brand-name">Admin Vite TS</strong
                ><span class="brand-caption">轻量管理 · 高效构建</span></span
            >
        </router-link>
        <div v-if="!isActive" class="nav-caption">工作空间</div>
        <el-scrollbar class="nav-scrollbar" wrapClass="scrollbar-wrapper">
            <el-menu
                class="nav-menu"
                :class="{ 'is-collapsed': isActive }"
                :defaultActive="route.path"
                :collapse="isActive"
                :collapseTransition="false"
                :defaultOpeneds="openedsArr"
                :router="true"
            >
                <template v-for="item in menus" :key="item.path">
                    <recursiveMenuItem v-if="item.meta.show" :item="item" :parentPath="item.path" />
                </template>
            </el-menu>
        </el-scrollbar>
        <div v-if="!isActive" class="sidebar-footer">
            <span class="status-dot"></span>Vue 3 + TypeScript<span class="version">v{{ packageInfo.version }}</span>
        </div>
    </aside>
</template>
<script setup lang="ts">
// Vue 3 要求 v-for template 的 key 位于 template；项目 ESLint 默认继承 Vue 2 规则。
/* eslint vue/no-v-for-template-key: "off", vue/no-v-for-template-key-on-child: "error" */
import dynamicRouter from '@/router/dynamicRouter';
import { deepCopy } from '@/utils';
import recursiveMenuItem from './recursiveMenuItem.vue';
import packageInfo from '../../../package.json';
/** 当前路由，用于高亮选中的导航。 */
const route = useRoute();
/** 外部导航折叠状态。 */
const { isActive } = defineProps({ isActive: { type: Boolean } });
/** 经过可见性过滤的导航列表。 */
const menus = ref([]);
/** 默认展开的导航路径。 */
const openedsArr = ref([]);
/** 初始化导航；无参数、无返回值；读取路由副本并更新菜单。 */
onMounted(() => {
    showMenu(deepCopy(dynamicRouter));
});
/** 生成菜单；arr 为路由副本；无返回值；更新 menus 并过滤副本子路由。 */
function showMenu(arr) {
    menus.value = arr.filter((item) => {
        if (!item.meta?.show) return false;
        if (item.children?.length) {
            item.children = filterChildren(item.children);
            return item.children.length > 0;
        }
        return true;
    });
}
/** 递归筛选菜单；children 为子路由；返回可见路由；仅修改路由副本。 */
function filterChildren(children) {
    return children.filter((child) => {
        if (!child.meta?.show) return false;
        if (child.children?.length) {
            child.children = filterChildren(child.children);
            return child.children.length > 0;
        }
        return true;
    });
}
</script>
<style lang="scss" scoped>
.sidebar-container {
    width: 228px;
    height: 100dvh;
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 1005;
    background: var(--app-frame);
    display: flex;
    flex-direction: column;
    &.is-collapsed {
        width: 64px;
    }
    .brand {
        height: 88px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 20px;
        box-sizing: border-box;
        text-decoration: none;
        color: var(--app-ink);
        &.is-collapsed {
            justify-content: center;
            padding: 0;
            box-sizing: border-box;
        }
        .brand-mark {
            position: relative;
            color: var(--app-accent);
            font-family: 'Segoe UI', sans-serif;
            font-size: 36px;
            font-weight: bold;
            line-height: 1;
            .brand-dot {
                position: absolute;
                right: -5px;
                top: 5px;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: var(--app-accent);
            }
        }
        .brand-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
            white-space: nowrap;
            .brand-name {
                font-size: 16px;
            }
            .brand-caption {
                font-size: 11px;
                color: var(--app-muted);
            }
        }
    }
    .nav-caption {
        padding: 16px 24px 12px;
        box-sizing: border-box;
        font-size: 12px;
        color: var(--app-muted);
    }
    .nav-scrollbar {
        flex: 1;
        min-height: 0;
        .nav-menu {
            --el-menu-bg-color: transparent;
            --el-menu-text-color: #53626b;
            --el-menu-active-color: #20282d;
            --el-menu-hover-bg-color: #e6ebed;
            border: 0;
            width: 100%;
            // 收起后菜单项宽 44px，24px 图标两侧各留 10px，与 64px 导航栏中线对齐。
            &.is-collapsed {
                --el-menu-base-level-padding: 10px;
            }
            :deep(.el-menu-item),
            :deep(.el-sub-menu__title) {
                height: 44px;
                margin: 4px 10px;
                border-radius: 6px;
            }
            :deep(.el-menu-item) {
                &.is-active {
                    background: #e2e8eb;
                    font-weight: bold;
                }
            }
            :deep(.el-menu--inline) {
                background: transparent;
            }
        }
    }
    .sidebar-footer {
        margin: 16px;
        padding: 14px 4px;
        box-sizing: border-box;
        border-top: 1px solid var(--app-border);
        font-size: 11px;
        color: var(--app-muted);
        display: flex;
        align-items: center;
        gap: 7px;
        white-space: nowrap;
        .status-dot {
            width: 6px;
            height: 6px;
            background: #44816d;
            border-radius: 50%;
        }
        .version {
            margin-left: auto;
        }
    }
}
@media (max-width: 1100px) {
    .sidebar-container {
        box-shadow: 8px 0 24px rgb(20 30 36 / 8%);
        &.is-collapsed {
            display: none;
        }
    }
}
</style>
