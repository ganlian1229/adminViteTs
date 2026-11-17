<template>
    <div class="advertising content-page">
        <h1 class="page-title">广告位2</h1>
        <p class="page-description">日期筛选示例，支持自定义时间范围。</p>
        <div class="filter-box">
            <div class="filter-item">
                <el-date-picker
                    v-model="filterTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    @change="filterFun"
                    align="center"
                    :shortcuts="shortcuts"
                >
                </el-date-picker>
            </div>
        </div>
        <el-empty description="当前页面尚未配置业务内容" :imageSize="96" />
    </div>
</template>
<script setup lang="ts">
/** 日期快捷选项。 */
let shortcuts = [
    {
        text: '最近一周',
        /** 返回最近一周的范围；无参数；返回日期数组；无副作用。 */
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
        }
    },
    {
        text: '最近一个月',
        /** 返回快捷日期范围；无参数；返回日期数组；无副作用。 */
        value() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
        }
    },
    {
        text: '最近三个月',
        /** 返回快捷日期范围；无参数；返回日期数组；无副作用。 */
        value() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
        }
    }
];
/** 选中的日期范围。 */
let filterTime = ref([]);

/** 处理日期筛选；无参数、无返回值；触发当前查询。 */
function filterFun() {
    getDataList();
}
/** 查询演示；无参数、无返回值；输出选中的日期。 */
function getDataList() {
    console.log(filterTime);
}
</script>
<style lang="scss" scoped>
.advertising {
    .filter-box {
        padding: 18px;
        box-sizing: border-box;
        background: var(--el-fill-color-light);
        border-radius: 8px;
        .filter-item {
            :deep(.el-date-editor) {
                max-width: 100%;
                box-sizing: border-box;
            }
        }
    }
}
</style>
