<template>
    <div class="article-admin content-page">
        <h1 class="page-title">球会下场须知</h1>
        <p class="page-description">表单输入与页面跳转演示，保留原有交互。</p>
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
/** 页面跳转实例。 */
const router = useRouter();
/** 表单原始字段。 */
let formData = reactive({
    userName: '',
    password: '',
    phoneNumber: '',
    number: ''
});

/** 打印表单；无参数、无返回值；输出当前表单。 */
function consoleFormData() {
    console.log('formData', formData);
}

/** 重置表单；无参数、无返回值；清空原字段。 */
function resetFormData() {
    Object.assign(formData, {
        userName: '',
        password: '',
        phoneNumber: '',
        number: ''
    });
}

/** 响应式原理演示使用的弱引用映射。 */
const targetMap = new WeakMap();
/** 运行 WeakMap 示例；无参数、无返回值；写入映射并打印。 */
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

/** 跳转详情；无参数、无返回值；改变路由。 */
function jumpDetails() {
    router.push({
        path: '/articleAdmin/testDetails/' + new Date().getTime()
    });
}
</script>
<style lang="scss" scoped>
.article-admin {
    .list-item {
        display: flex;
        align-items: center;
        gap: 16px;
        max-width: 520px;
        margin-bottom: 22px;
        .text {
            width: 68px;
            flex-shrink: 0;
            font-size: 14px;
            color: var(--app-muted);
        }
    }
}
</style>
