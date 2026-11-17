<template>
    <div class="advertising content-page">
        <h1 class="page-title">广告位</h1>
        <p class="page-description">按时间范围查看内容，以下为模板字段展示示例。</p>
        <div class="filter-box">
            <div class="filter-item">
                <el-date-picker
                    v-model="filterTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    @change="filterFun"
                    align="center"
                    :shortcuts="shortcuts"
                >
                </el-date-picker>
            </div>
        </div>
        <div class="body-box">
            <div class="box">
                <div class="box-item" v-for="(item, index) in boxList" :key="index">
                    <div class="label">{{ item.label }}</div>
                    <div class="value">{{ item.value }}</div>
                </div>
            </div>
        </div>
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

/** 直接赋值的模板展示字段。 */
let boxList = ref([
    {
        label: '展示字段',
        value: '支持文本内容与自适应布局'
    },
    {
        label: '筛选方式',
        value: '日期范围与快捷选择'
    },
    {
        label: '数据说明',
        value: '当前为演示内容，接入接口后替换'
    }
]);

/** 挂载日志；无参数、无返回值；输出控制台日志。 */
onMounted(() => {
    console.log('mounted');
});
/** 激活日志；无参数、无返回值；输出控制台日志。 */
onActivated(() => {
    console.log('activated');
});

/** 处理日期筛选；无参数、无返回值；触发当前查询。 */
function filterFun() {
    getDataList();
}
/** 选中的日期范围。 */
let filterTime = ref([]);
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
        margin-bottom: 24px;
        .filter-item {
            max-width: 100%;
            :deep(.el-date-editor) {
                max-width: 100%;
                box-sizing: border-box;
            }
        }
    }
    .body-box {
        .box {
            max-width: 760px;
            border: 1px solid var(--app-border);
            border-radius: 8px;
            .box-item {
                padding: 20px;
                box-sizing: border-box;
                display: flex;
                gap: 24px;
                border-bottom: 1px solid var(--app-border);
                &:last-child {
                    border-bottom: 0;
                }
                .label {
                    width: 100px;
                    flex-shrink: 0;
                    font-size: 13px;
                    color: var(--app-muted);
                }
                .value {
                    flex: 1;
                    font-size: 14px;
                    overflow-wrap: anywhere;
                }
            }
        }
    }
}
@media (max-width: 640px) {
    .advertising {
        .body-box {
            .box {
                .box-item {
                    gap: 12px;
                    .label {
                        width: 72px;
                    }
                }
            }
        }
    }
}
</style>
