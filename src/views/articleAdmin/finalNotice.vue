<template>
    <div class="article-admin">
        <p class="list-item">
            <span class="text">姓名：</span>
            <el-input v-model="formData.userName"></el-input>
        </p>
        <p class="list-item">
            <span class="text">密码：</span>
            <el-input v-model="formData.password" show-password></el-input>
        </p>
        <p class="list-item">
            <span class="text">手机号：</span>
            <el-input v-model="formData.phoneNumber"></el-input>
        </p>
        <p class="list-item">
            <span class="text">数字：</span>
            <el-input v-numbers v-model="formData.number"></el-input>
        </p>
        <el-button @click="jumpDetails">跳转到详情</el-button>
        <el-button @click="consoleFormData">打印formData</el-button>
        <el-button @click="resetFormData">重置数据</el-button>
        <el-button @click="testFun">测试</el-button>
    </div>
</template>
<script setup lang="ts">
const router = useRouter();
let formData = reactive({
    userName: '',
    password: '',
    phoneNumber: '',
    number: ''
});

function consoleFormData() {
    console.log('formData', formData);
}

function resetFormData() {
    Object.assign(formData, {
        userName: '',
        password: '',
        phoneNumber: '',
        number: ''
    });
}

const targetMap = new WeakMap();
function testFun() {
    const a = { a: 1 };
    let depsMap = targetMap.get(a);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(a, depsMap);
    }
    depsMap.set('bbbb', 2);
    console.log('depsMap', depsMap);
}

function jumpDetails() {
    router.push({
        path: '/articleAdmin/testDetails/' + new Date().getTime()
    });
}
</script>
<style lang="scss">
.article-admin {
    background-color: transparent !important;
}
</style>
