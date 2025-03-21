<template>
    <el-sub-menu v-if="shouldUseSubMenu(item)" :index="fullPath">
        <template #title>
            <el-icon>
                <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
        </template>
        <RecursiveMenuItem
            :isChildren="true"
            v-for="child in item.children"
            :key="child.path"
            :item="child"
            :parentPath="fullPath"
        />
    </el-sub-menu>
    <el-menu-item v-else :index="menuItemPath">
        <el-icon>
            <component :is="targetItem.meta.icon" />
        </el-icon>
        <template #title>{{ targetItem.meta.title }}</template>
    </el-menu-item>
</template>

<script setup lang="ts">
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
const targetItem = computed(() => {
    return getSingleShowChild(props.item) || props.item;
});

const menuItemPath = computed(() => {
    const path = targetItem.value.path.startsWith('/') ? targetItem.value.path : `/${targetItem.value.path}`;
    return props.parentPath + path;
});

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
const shouldUseSubMenu = (item) => {
    return item.children && item.children.filter((child) => child.meta.show).length > 1;
};
const getSingleShowChild = (item) => {
    return item.children && item.children.find((child) => child.meta.show);
};
</script>
