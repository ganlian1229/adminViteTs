<!-- 文件列表 -->
<template>
    <div class="file-list">
        <el-table
            class="resizable-table"
            :data="tableData"
            showOverflowTooltip
            border
            height="500"
            stripe
            :allowDragLastColumn="false"
            rowKey="id"
            @headerDragend="handleHeaderDragend"
        >
            <el-table-column
                v-for="item in tableColumns"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.minWidth"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
const tableData = ref([
    {
        id: 1,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        age: 30,
        job: '工程师'
    },
    {
        id: 2,
        date: '2016-05-02',
        name: '张三',
        address: '北京市海淀区苏州街',
        age: 28,
        job: '设计师'
    },
    {
        id: 3,
        date: '2016-05-04',
        name: '李四',
        address: '广州市天河区天河北路',
        age: 32,
        job: '产品经理'
    },
    {
        id: 4,
        date: '2016-05-01',
        name: '王五',
        address: '深圳市南山区深南大道',
        age: 26,
        job: '前端开发'
    }
]);
const tableColumns = ref([
    {
        prop: 'date',
        label: '日期',
        minWidth: '150'
    },
    {
        prop: 'name',
        label: '姓名',
        minWidth: '120'
    },

    {
        prop: 'address',
        label: '地址',
        minWidth: '300'
    },

    {
        prop: 'age',
        label: '年龄',
        minWidth: '100'
    },

    {
        prop: 'job',
        label: '职业',
        minWidth: '200'
    }
]);

function handleHeaderDragend(newWidth: number, oldWidth: number, column: any, event: MouseEvent) {
    console.log(newWidth, oldWidth, column, event);
}
</script>

<style lang="scss" scoped>
.file-list {
    height: 100%;
    width: 100%;
}
</style>
