<template>
    <div class="article-admin content-page" id="articleAdmin">
        <h1 class="page-title">球场预定规则</h1>
        <div class="other">其他东西</div>
        <div class="scroll-box" id="scrollBox">
            <p class="box-item" v-for="(item, index) in dataList" :key="index">
                {{ index + 1 }}
            </p>
        </div>
        <div class="other">其他东西</div>
        <div class="other">其他东西</div>
        <div class="other">其他东西</div>
        <div class="other">其他东西</div>
        <div class="other">其他东西</div>
    </div>
</template>
<script setup lang="ts">
//数据
let dataList = ref([]);
//scroll高度
let scrollBoxHeight = ref(0);
//scroll距离顶部的高度
let scrollBoxOffsetTop = ref(0);
//是否加载中
let isLoading = ref(false);
/** 挂载示例；无参数、无返回值；加载数据并绑定滚动。 */
onMounted(() => {
    addData();
    window.addEventListener('scroll', scrollFun, false);
});
/** 滚动加载；无参数、无返回值；满足阈值时追加数据。 */
function scrollFun() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    // console.log(this.scrollBoxHeight + this.scrollBoxOffsetTop - 50);
    // console.log(scrollTop);
    let elementClientHeight = document.documentElement.clientHeight;
    // console.log(elementClientHeight);
    // console.log(scrollTop + bodyClientHeight);
    if (!isLoading.value && scrollBoxHeight.value + scrollBoxOffsetTop.value - 50 <= scrollTop + elementClientHeight) {
        isLoading.value = true;
        //需要加载数据了
        console.log('11111');
        setTimeout(() => {
            addData();
        }, 1000);
    }
}
/** 追加示例；无参数、无返回值；更新列表并测量滚动区。 */
function addData() {
    for (let i = 0; i <= 10; i++) {
        dataList.value.push({});
    }
    isLoading.value = false;
    nextTick(() => {
        let scroolObj = document.getElementById('scrollBox');
        // console.log(scroolObj.offsetHeight);
        scrollBoxHeight.value = scroolObj.offsetHeight;
        scrollBoxOffsetTop.value = scroolObj.offsetTop;
        console.log(scrollBoxHeight.value);
        console.log(scrollBoxOffsetTop.value);
    });
}
/** 释放滚动监听；无参数、无返回值；移除全局监听。 */
onUnmounted(() => {
    window.removeEventListener('scroll', scrollFun);
});
</script>
<style lang="scss" scoped>
.article-admin {
    .other {
        font-size: 20px;
        padding-bottom: 28px;
        box-sizing: border-box;
        color: var(--app-muted);
    }
    .scroll-box {
        .box-item {
            font-size: 14px;
            padding: 16px;
            box-sizing: border-box;
            border-bottom: 1px solid var(--app-border);
        }
    }
}
</style>
