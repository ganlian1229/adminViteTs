<template>
    <section class="directive-demo">
        <div class="demo-column">
            <h3 class="demo-title">指令交互</h3>
            <p class="demo-caption">长按、防抖、节流与拖拽，保留模板原有演示。</p>
            <div class="demo-actions">
                <el-button v-longpress="longPressFun">长按 2 秒</el-button
                ><el-button v-longpress="{ time: 4000, callBack: longPressFun }">长按 4 秒</el-button>
                <el-button v-debounce="debounceFun">防抖</el-button><el-button v-throttle="throttleFun">节流</el-button>
            </div>
            <div class="drag-area" v-resize="boxResizeFun"><div class="drag-block" v-drag="dragFun">拖动我</div></div>
            <div class="load-more" v-loadmore="getDataList">
                <div class="load-row" v-for="(item, index) in dataList" :key="index">滚动加载示例 {{ index + 1 }}</div>
            </div>
            <p class="event-note" aria-live="polite">{{ eventNote }}</p>
        </div>
        <div class="demo-column">
            <h3 class="demo-title">组件与状态</h3>
            <p class="demo-caption">
                当前登录 userId：{{ userInfo.userId }} · 标签：{{
                    globalFun.globalFilterLabel('11', [{ label: '水电费', value: '11' }])
                }}
            </p>
            <globalCom ref="globalComRef" v-model:obj="globalComObj" />
            <testGlobalCom />
        </div>
    </section>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import storeObj from '@/store';
import globalFun from '@/utils/globalFun';
defineOptions({ name: 'directiveDemo' });
/** Pinia 登录用户。 */
const { userInfo } = storeToRefs(storeObj.mainStore);
/** 演示组件的双向绑定对象。 */
const globalComObj = ref({ age: 18 });
/** 全局组件实例。 */
const globalComRef = ref();
/** 滚动加载的演示列表。 */
const dataList = ref([]);
/** 最近一次交互反馈。 */
const eventNote = ref('点击按钮或拖动方块查看交互反馈。');
/** 长按反馈；无参数、无返回值；更新状态并显示消息。 */
function longPressFun() {
    eventNote.value = '长按事件已触发';
    ElMessage.success(eventNote.value);
}
/** 尺寸变化反馈；无参数、无返回值；记录演示区域尺寸变化。 */
function boxResizeFun() {
    eventNote.value = '演示区域尺寸已更新';
}
/** 拖拽反馈；event 为指令传入的事件；无返回值；更新演示反馈。 */
function dragFun(event) {
    eventNote.value = '拖拽事件已触发';
    console.log(event);
}
/** 防抖反馈；无参数、无返回值；更新交互提示。 */
function debounceFun() {
    eventNote.value = '防抖函数已执行';
}
/** 节流反馈；无参数、无返回值；更新交互提示。 */
function throttleFun() {
    eventNote.value = '节流函数已执行';
}
/** 加载示例；无参数、无返回值；向原列表追加 20 条数据。 */
function getDataList() {
    for (let i = 0; i < 20; i++) dataList.value.push({ index: dataList.value.length });
}
/** 初始化列表；无参数、无返回值；首次挂载时加载示例。 */
onMounted(() => {
    getDataList();
});
</script>
<style lang="scss" scoped>
.directive-demo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    .demo-column {
        min-width: 0;
        .demo-title {
            font-size: 15px;
            font-weight: bold;
            margin: 0 0 10px;
        }
        .demo-caption {
            font-size: 13px;
            color: var(--app-muted);
            line-height: 1.7;
            margin-bottom: 18px;
        }
        .demo-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            :deep(.el-button) {
                margin: 0;
            }
        }
        .drag-area {
            position: relative;
            height: 100px;
            margin: 16px 0;
            border: 1px dashed #cdd9de;
            border-radius: 6px;
            overflow: hidden;
            .drag-block {
                position: absolute;
                left: 12px;
                top: 12px;
                padding: 16px;
                box-sizing: border-box;
                background: var(--app-frame);
                color: var(--app-accent);
                border-radius: 6px;
                cursor: move;
            }
        }
        .load-more {
            height: 150px;
            overflow-y: auto;
            border: 1px solid var(--app-border);
            border-radius: 6px;
            .load-row {
                padding: 10px 14px;
                box-sizing: border-box;
                border-bottom: 1px solid var(--app-border);
                font-size: 13px;
            }
        }
        .event-note {
            margin-top: 12px;
            color: var(--app-muted);
            font-size: 12px;
        }
    }
}
@media (max-width: 760px) {
    .directive-demo {
        grid-template-columns: 1fr;
    }
}
</style>
