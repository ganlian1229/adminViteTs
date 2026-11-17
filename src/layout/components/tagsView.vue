<template>
    <div class="tags-view">
        <router-link class="home-link" :class="{ 'is-active': route.path === '/main/index' }" to="/main/index"
            ><el-icon><House /></el-icon><span>首页</span></router-link
        >
        <el-scrollbar class="tag-scrollbar" @scroll="closeMenu">
            <div class="tag-list">
                <router-link
                    v-for="tag in visitedViews"
                    :key="tag.path"
                    class="tag-item"
                    :class="{ 'is-active': route.path === tag.path }"
                    :to="tag.path"
                    @click.middle="closeSelectedTag(tag)"
                    @contextmenu.prevent="openMenu(tag, $event)"
                >
                    <span class="tag-title">{{ tag.title }}</span>
                    <button
                        class="close-button"
                        :aria-label="`关闭${tag.title}`"
                        @click.prevent.stop="closeSelectedTag(tag)"
                    >
                        <el-icon><Close /></el-icon>
                    </button>
                </router-link>
            </div>
        </el-scrollbar>
        <div
            v-if="menuObj.visible"
            class="context-menu"
            :style="{ left: menuObj.left + 'px', top: menuObj.top + 'px' }"
            @keydown.esc="closeMenu"
        >
            <button class="menu-item" @click="closeSelectedTag(menuObj.selectedTag)">关闭当前</button>
            <button class="menu-item" @click="closeOthersTags">关闭其它</button>
            <button class="menu-item" @click="closeAllTags">关闭所有</button>
        </div>
    </div>
</template>
<script setup>
import storeObj from '@/store';
/** 路由导航实例。 */
const router = useRouter();
/** 当前页面路由。 */
const route = useRoute();
/** 已访问的标签列表，保持 Pinia 响应性。 */
const { visitedViews } = storeToRefs(storeObj.tagsViewStore);
/** 标签增删操作。 */
const { addView, closeView, closeMultipleView } = storeObj.tagsViewStore;
/** 右键菜单位置及目标标签。 */
const menuObj = reactive({ visible: false, left: 0, top: 0, selectedTag: {} });
/** 跟踪路由；newVal 为当前路由；无返回值；非首页时记录标签。 */
watch(
    () => route.fullPath,
    () => {
        if (route.path !== '/main/index') addView(route);
    },
    { immediate: true }
);
/** 关闭指定标签；tag 为目标；无返回值；关闭当前页时导航至最后一页。 */
function closeSelectedTag(tag) {
    closeView(tag);
    if (tag.path === route.path) toLastView();
    closeMenu();
}
/** 关闭其他标签；无参数、无返回值；更新 Pinia 并导航。 */
function closeOthersTags() {
    closeMultipleView(visitedViews.value.filter((item) => item.path !== menuObj.selectedTag.path));
    toLastView();
}
/** 关闭全部标签；无参数、无返回值；清空访问列表并导航首页。 */
function closeAllTags() {
    closeMultipleView(visitedViews.value);
    toLastView();
}
/** 打开最后访问页；无参数、无返回值；改变当前路由。 */
function toLastView() {
    router.push(visitedViews.value[visitedViews.value.length - 1] || '/main/index');
}
/** 显示菜单；tag 为标签，event 为鼠标事件；无返回值；更新菜单位置和可见性。 */
function openMenu(tag, event) {
    Object.assign(menuObj, {
        left: Math.max(8, Math.min(event.clientX, window.innerWidth - 136)),
        top: Math.min(event.clientY + 5, window.innerHeight - 132),
        visible: true,
        selectedTag: tag
    });
}
/** 收起菜单；无参数、无返回值；更新可见性。 */
function closeMenu() {
    menuObj.visible = false;
}
/** 绑定外部点击；无参数、无返回值；注册全局事件。 */
onMounted(() => {
    window.addEventListener('click', closeMenu);
});
/** 清理外部点击；无参数、无返回值；移除全局事件。 */
onUnmounted(() => {
    window.removeEventListener('click', closeMenu);
});
</script>
<style lang="scss" scoped>
.tags-view {
    height: 40px;
    display: flex;
    align-items: stretch;
    gap: 12px;
    padding: 0 20px;
    box-sizing: border-box;
    .home-link {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 13px;
        color: var(--app-muted);
        text-decoration: none;
        border-bottom: 2px solid transparent;
        flex-shrink: 0;
        &.is-active {
            border-bottom-color: var(--app-accent);
            color: var(--app-ink);
            font-weight: bold;
        }
    }
    .tag-scrollbar {
        flex: 1;
        min-width: 0;
        .tag-list {
            display: flex;
            height: 40px;
            gap: 16px;
            width: max-content;
            .tag-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--app-muted);
                border-bottom: 2px solid transparent;
                text-decoration: none;
                box-sizing: border-box;
                &.is-active {
                    border-bottom-color: var(--app-accent);
                    color: var(--app-ink);
                    font-weight: bold;
                }
                &:hover {
                    color: var(--app-ink);
                }
                .tag-title {
                    white-space: nowrap;
                }
                .close-button {
                    border: 0;
                    background: transparent;
                    color: var(--app-muted);
                    display: grid;
                    place-items: center;
                    width: 22px;
                    height: 24px;
                    cursor: pointer;
                    border-radius: 4px;
                    &:hover {
                        background: #dfe5e8;
                    }
                }
            }
        }
    }
    .context-menu {
        position: fixed;
        z-index: 3000;
        background: #fff;
        border: 1px solid var(--app-border);
        border-radius: 8px;
        padding: 5px;
        box-sizing: border-box;
        box-shadow: 0 6px 20px rgb(20 30 36 / 12%);
        .menu-item {
            display: block;
            width: 120px;
            border: 0;
            background: transparent;
            padding: 9px 14px;
            box-sizing: border-box;
            text-align: left;
            color: var(--app-ink);
            cursor: pointer;
            border-radius: 4px;
            &:hover {
                background: var(--app-frame);
            }
        }
    }
}
</style>
