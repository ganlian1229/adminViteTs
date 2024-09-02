<template>
    <div class="advertising">
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
//时间快捷选择
let shortcuts = [
    {
        text: '最近一周',
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
        }
    },
    {
        text: '最近一个月',
        value() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
        }
    },
    {
        text: '最近三个月',
        value() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
        }
    }
];

let boxList = ref([
    {
        label: '阿里上课的',
        value: '阿是两节课打开了'
    },
    {
        label: '阿里上课的',
        value: '阿是两节课打开了'
    },
    {
        label: '阿里上课的',
        value: '阿是两节课打开了'
    }
]);

onMounted(() => {
    console.log('mounted');
});
onActivated(() => {
    console.log('activated');
});

//筛选方法
function filterFun() {
    getDataList();
}
//时间筛选
let filterTime = ref([]);
//获取数据列表
function getDataList() {
    console.log(filterTime);
}
</script>
<style lang="scss">
.advertising {
    .box {
        width: 500px;
        border: 1px solid #000;

        .box-item {
            padding: 10px 20px;
            display: flex;
            .label {
                width: 150px;
                flex: none;
            }
            .value {
                flex: auto;
                word-wrap: break-word;
                word-break: break-all;
            }
        }
    }
}
</style>
