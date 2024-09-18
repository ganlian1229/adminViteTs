<template>
    <div class="globalCom">
        <p>age:{{ obj.age }}</p>
        <el-button @click="handleAdd()">添加age</el-button>
        <span ref="spanDom" v-bind="$attrs">动态添加的全局组件</span>
        <p>{{ msg }}</p>
    </div>
</template>
<script setup lang="ts">
let spanDom = useTemplateRef('spanDom');

const { msg = '默认参数' } = defineProps<{
    msg?: string;
}>();

let obj = defineModel('obj', {
    type: Object,
    default: () => ({
        age: 18,
        name: 'zhangsan'
    })
});

function handleAdd() {
    obj.value.age += 1;
}

defineExpose({
    spanDom
});
</script>
<style lang="scss" scoped></style>
