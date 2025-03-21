<template>
    <div class="sidebar-container" :class="isActive ? 'hideSidebar' : ''">
        <div class="logo-box">logo</div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="route.path"
                :collapse="isActive"
                :default-openeds="openedsArr"
                :router="true"
                background-color="#212740"
                text-color="#555e86"
                active-text-color="#fff"
            >
                <template v-for="item in menus">
                    <template v-if="item.meta.show">
                        <RecursiveMenuItem :item="item" :parentPath="item.path" :key="item.path" />
                    </template>
                </template>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import dynamicRouter from '@/router/dynamicRouter';
import { deepCopy } from '@/utils';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RecursiveMenuItem from './RecursiveMenuItem.vue';

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['update:isActive']);
const { isActive } = defineProps({
    isActive: {
        type: Boolean
    }
});

//左侧导航列表
let menus = ref([]);
//需要展开的path
let openedsArr = ref([]);

onMounted(() => {
    showMenu(deepCopy(dynamicRouter));
});

//显示左侧导航
function showMenu(arr) {
    var menusArr = [];
    arr.forEach((val) => {
        if (val.meta && val.meta.show) {
            if (val.children && val.children.length) {
                val.children = filterChildren(val.children);
                if (val.children.length > 0) {
                    menusArr.push(val);
                }
            } else {
                menusArr.push(val);
            }
        }
    });
    menus.value = menusArr;
}

//递归过滤children
function filterChildren(children) {
    return children.filter((child) => {
        if (child.meta && child.meta.show) {
            if (child.children && child.children.length) {
                child.children = filterChildren(child.children);
                return child.children.length > 0;
            }
            return true;
        }
        return false;
    });
}
</script>

<style lang="scss" scoped>
.sidebar-container {
    width: 210px;
    background-color: #212740;
    height: 100vh;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1005;
    overflow: hidden;
    transition: width 0.28s;
    // padding-top: 85px;
    &.hideSidebar {
        width: 54px !important;
    }
    .logo-box {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        width: 100%;
    }

    :deep(.el-scrollbar) {
        height: 100%;
        .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
    :deep(.el-menu) {
        border: none;
        height: 100%;
        width: 100% !important;
    }
}
</style>
