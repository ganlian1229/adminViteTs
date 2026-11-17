<template>
    <el-sub-menu v-if="shouldUseSubMenu(item)" :index="fullPath">
        <template #title>
            <el-icon>
                <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
        </template>
        <recursiveMenuItem
            :isChildren="true"
            v-for="child in item.children"
            :key="child.path"
            :item="child"
            :parentPath="fullPath"
        />
    </el-sub-menu>
    <el-menu-item v-else :index="menuItemPath">
        <el-icon>
            <component :is="targetItem.meta.icon || item.meta.icon" />
        </el-icon>
        <template #title>{{ targetItem.meta.title }}</template>
    </el-menu-item>
</template>

<script setup lang="ts">
/** 当前菜单路由、父级路径与递归层级属性。 */
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    parentPath: {
        type: String,
        required: true
    },
    isChildren: {
        type: Boolean,
        default: false
    }
});
/** 只有一个可见子路由时直接展示该子路由；返回目标路由；不修改原数据。 */
const targetItem = computed(() => {
    return getSingleShowChild(props.item) || props.item;
});

/** 菜单项跳转路径；无参数；返回完整路径；无副作用。 */
const menuItemPath = computed(() => {
    const path = targetItem.value.path.startsWith('/') ? targetItem.value.path : `/${targetItem.value.path}`;
    return props.parentPath + path;
});

/** 递归子菜单路径；无参数；返回完整路径；无副作用。 */
const fullPath = computed(() => {
    const path = props.item.path.startsWith('/') ? props.item.path : `/${props.item.path}`;
    if (props.item.children && props.item.children.filter((child) => child.meta.show).length > 1) {
        if (props.isChildren) {
            return `${props.parentPath}${path}`;
        }
        return `${props.parentPath}`;
    }
    return `${props.parentPath}${path}`;
});
/** 判断是否分组；item 为路由；返回是否包含多个可见子项；无副作用。 */
const shouldUseSubMenu = (item) => {
    return item.children && item.children.filter((child) => child.meta.show).length > 1;
};
/** 查找可见子项；item 为路由；返回首个可见子路由；无副作用。 */
const getSingleShowChild = (item) => {
    return item.children && item.children.find((child) => child.meta.show);
};
</script>
