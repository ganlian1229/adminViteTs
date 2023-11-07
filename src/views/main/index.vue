<template>
    <div class="main-index">
        <div class="box-resize" v-resize="boxResizeFun"></div>
        <div class="left">
            <p>使用pinia储存的登录userId：{{ userInfo.userId }}</p>
            <div class="load-more-box" v-loadmore="moreFun">
                <p v-for="(item, index) in dataList" :key="index">{{ index }}</p>
            </div>
            <div class="box">
                <h1 v-drag="{ dom: 'dom.parent', callBack: dragFun }">1111</h1>
            </div>
            <div class="box" v-drag="dragFun"></div>

            <el-button v-longpress="longPressFun">长按2秒</el-button>
            <el-button v-longpress="{ time: 4000, callBack: longPressFun }">长按4秒</el-button>
        </div>
        <div class="right">
            <globalCom class="test-span" ref="spanDom"></globalCom>
            <testGlobalCom></testGlobalCom>
            <div>
                <el-button v-debounce="debounceFun">防抖</el-button>
                <el-button v-throttle="throttleFun">节流</el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import storeObj from '@/store';
defineOptions({
    name: 'mainVue'
});

let { userInfo } = storeToRefs(storeObj.mainStore);

let number = ref('');
let dataList = ref([]);
let spanDom = ref(null);
onActivated(() => {
    getDataList();
    console.log('spanDom', spanDom.value.spanDom);
});

function longPressFun() {
    console.log('长按事件触发！');
}
function boxResizeFun() {
    console.log('box-resize大小改变了！');
}
function moreFun() {
    getDataList();
}
function dragFun(event) {
    console.log(event);
}

function debounceFun() {
    console.log('防抖函数');
}

function throttleFun() {
    console.log('节流函数');
}

function getDataList() {
    for (let i = 0; i < 20; i++) {
        dataList.value.push({
            index: i
        });
    }
}

// let a = ?
// if(a == 1 && a == 2 && a == 3){
//     console.log(1111)
// }
</script>
<style lang="scss">
.main-index {
    background-color: transparent !important;
    display: flex;
    // font-size: 20px;
    .right {
        margin-left: 50px;
    }
    .box-resize {
        position: absolute;
        top: 0;
        width: 100%;
    }
    .box {
        position: absolute;
        left: 330px;
        top: 100px;
        width: 50px;
        height: 50px;
        background-color: red;
    }
    .load-more-box {
        width: 200px;
        height: 300px;
        overflow-y: auto;
    }
    .test {
        display: flex;
        align-items: center;
    }
    .el-input {
        width: 150px;
        margin-left: 10px;
    }
}
</style>
