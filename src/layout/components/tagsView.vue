<!-- 标签页 -->
<template>
    <div class="tags-view">
        <router-link
            :class="route.path === '/main/index' ? 'active' : ''"
            class="tags-view-item house-link"
            :to="{ path: '/main/index' }"
        >
            <el-icon>
                <component :is="'House'"></component>
            </el-icon>
        </router-link>
        <el-scrollbar @handleScroll="handlerScroll">
            <div class="scrollbar-flex-content">
                <router-link
                    v-for="tag in visitedViews"
                    :key="tag.path"
                    class="tags-view-item"
                    :to="{ path: tag.path }"
                    @click.middle.native="closeSelectedTag(tag)"
                    @contextmenu.prevent.native="openMenu(tag, $event)"
                >
                    <span>{{ tag.title }}</span>
                    <el-icon class="icon-close" @click.prevent.stop="closeSelectedTag(tag)">
                        <component :is="'Close'"></component>
                    </el-icon>
                </router-link>
            </div>
        </el-scrollbar>

        <ul
            v-show="menuObj.visible"
            :style="{ left: menuObj.left + 'px', top: menuObj.top + 'px' }"
            class="contextmenu"
        >
            <li @click="closeSelectedTag(menuObj.selectedTag)">关闭当前</li>
            <li @click="closeOthersTags">关闭其它</li>
            <li @click="closeAllTags">关闭所有</li>
        </ul>
    </div>
</template>

<script setup>
import storeObj from '@/store';
const router = useRouter();
const route = useRoute();

const { visitedViews } = storeToRefs(storeObj.tagsViewStore);
const { addView, closeView, closeMultipleView } = storeObj.tagsViewStore;

watch(
    () => route,
    (newVal) => {
        console.log('routeName', newVal.name);
        if (newVal.path != '/main/index') {
            addView(newVal);
        }
    },
    {
        deep: true,
        immediate: true
    }
);

/**
 * @description: 关闭标签
 * @param {*} tag
 * @return {*}
 */
function closeSelectedTag(tag) {
    closeView(tag);
    if (tag.path == route.path) {
        toLastView();
    }
}

/**
 * @description: 关闭其他标签
 * @return {*}
 */
function closeOthersTags() {
    const closetViewArr = visitedViews.value.filter((item) => item.path != menuObj.selectedTag.path);
    closeMultipleView(closetViewArr);
    toLastView();
}
/**
 * @description: 关闭所有标签
 * @return {*}
 */
function closeAllTags() {
    closeMultipleView(visitedViews.value);
    toLastView();
}
/**
 * @description: 切换至最后一个标签
 * @return {*}
 */
function toLastView() {
    const lastView = visitedViews.value[visitedViews.value.length - 1];
    if (lastView) {
        router.push(lastView);
    } else {
        router.push({
            path: '/main/index'
        });
    }
}

const menuObj = reactive({
    visible: false,
    left: 0,
    top: 0,
    selectedTag: {}
});
function openMenu(tag, event) {
    const maxLeft = document.body.clientWidth - 80; // left boundary
    const left = event.clientX - 30;
    if (left > maxLeft) {
        menuObj.left = maxLeft;
    } else {
        menuObj.left = left;
    }
    menuObj.top = event.clientY + 5;
    menuObj.visible = true;
    menuObj.selectedTag = tag;
}

function closeMenu() {
    menuObj.visible = false;
}

onMounted(() => {
    window.addEventListener('click', closeMenu);
});

function handlerScroll() {
    console.log('handlerScroll');
    if (menuObj.visible) {
        closeMenu();
    }
}
</script>

<style lang="scss" scoped>
.tags-view {
    display: flex;
    height: 30px;

    .scrollbar-flex-content {
        display: flex;
    }
    .tags-view-item {
        padding: 0 12px;
        margin-left: 15px;
        border: 1px solid #d8dce5;
        border-radius: 4px;
        background: rgba(255, 143, 51, 0.1);
        color: #ff8f33;
        line-height: 1.8;
        font-size: 14px;
        position: relative;

        &.house-link {
            margin-left: 5px;
        }

        &.router-link-active {
            background: rgba(255, 143, 51, 1);
            color: #fff;
            border-color: #ff8f33;

            .icon-close {
                display: inline-block;
            }
        }

        .icon-close {
            display: none;
            margin-left: 5px;
            position: relative;
            top: 2px;
            border-radius: 50%;
            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }

    .contextmenu {
        background: #fff;
        z-index: 3000;
        position: absolute;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>
