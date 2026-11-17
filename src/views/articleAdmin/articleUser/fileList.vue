<!-- 公共表格手动测试页 -->
<template>
    <div class="file-list">
        <section class="test-panel">
            <div class="panel-title">commonTable 属性测试</div>
            <elForm class="test-controls" :inline="true" labelPosition="left">
                <elFormItem label="loading"><elSwitch v-model="options.loading" /></elFormItem>
                <elFormItem label="isSearched"><elSwitch v-model="options.isSearched" /></elFormItem>
                <elFormItem label="emptyScrollable"><elSwitch v-model="options.emptyScrollable" /></elFormItem>
                <elFormItem label="isShowColumns"><elSwitch v-model="options.isShowColumns" /></elFormItem>
                <elFormItem label="showPagination"><elSwitch v-model="options.showPagination" /></elFormItem>
                <elFormItem label="空数据"><elSwitch v-model="options.isEmpty" /></elFormItem>
                <elFormItem label="使用 columns"><elSwitch v-model="options.useColumns" /></elFormItem>
                <elFormItem label="分页别名"><elSwitch v-model="options.usePaginationAlias" /></elFormItem>
                <elFormItem label="columnDefaultValue"><elInput v-model="options.columnDefaultValue" /></elFormItem>
                <elFormItem label="columnsDefaultMinWidth">
                    <elInputNumber v-model="options.columnsDefaultMinWidth" :min="80" :max="400" :step="20" />
                </elFormItem>
                <elFormItem label="columnsDefaultAlign">
                    <elSelect v-model="options.columnsDefaultAlign" class="align-select">
                        <elOption label="left" value="left" />
                        <elOption label="center" value="center" />
                        <elOption label="right" value="right" />
                    </elSelect>
                </elFormItem>
            </elForm>
            <div class="test-hint">
                开启“空数据”后可组合测试搜索空状态、表头隐藏和横向滚动；关闭“使用 columns”可测试默认插槽。分页别名切换
                page/currentPage 和 layout/paginationLayout。
            </div>
        </section>

        <commonTable
            ref="commonTableRef"
            class="resizable-table"
            :data="visibleData"
            :loading="options.loading"
            :isSearched="options.isSearched"
            :emptyScrollable="options.emptyScrollable"
            :columns="options.useColumns ? tableColumns : []"
            :columnDefaultValue="options.columnDefaultValue"
            :columnsDefaultMinWidth="options.columnsDefaultMinWidth"
            :columnsDefaultAlign="options.columnsDefaultAlign"
            :isShowColumns="options.isShowColumns"
            :showPagination="options.showPagination"
            :pagination="paginationBind"
            tableRef="fileTableRef"
            paginationRef="filePaginationRef"
            showOverflowTooltip
            border
            height="500"
            stripe
            :allowDragLastColumn="false"
            rowKey="id"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
            @selectionChange="handleSelectionChange"
            @sortChange="handleSortChange"
            @rowClick="handleRowClick"
            @headerDragend="handleHeaderDragend"
        >
            <template #tableMainTop>
                <div class="slot-banner">
                    tableMainTop：表格上方插槽，共 {{ tableData.length }} 条测试数据，包含 0、false、空字符串、null 和
                    undefined。
                </div>
            </template>
            <template #toolLeft>
                <div class="tool-actions">
                    <elButton @click="handleClearSelection">toolLeft：清空选择</elButton>
                    <elButton @click="handleCheckRefs">获取表格 / 分页实例</elButton>
                </div>
            </template>
            <template #toolRight>
                <elTag>toolRight：已选 {{ selectedCount }} 条</elTag>
            </template>
            <template #toolTableMiddle>
                <div class="slot-banner">
                    toolTableMiddle：工具栏与表格之间。点击行、勾选、年龄排序或拖动列宽后，可在下方查看事件。
                </div>
            </template>
            <template #nameHeader="{ label }">
                <span class="custom-header">{{ label }}（单列表头插槽）</span>
            </template>
            <template #nameCell="{ row, col, $index }">
                <span class="custom-cell">{{ $index + 1 }}. {{ row.name }} / {{ col.prop }}</span>
            </template>
            <template #addressHeader="{ label }">
                <span class="custom-header">{{ label }}（分组子列表头插槽）</span>
            </template>
            <template #addressCell="{ row, col }">
                <span class="custom-cell">{{ row.address }} / {{ col.prop }}</span>
            </template>
            <template #actions="{ row }">
                <elButton link type="primary" @click.stop="handleRowClick(row)">查看 {{ row.id }}</elButton>
            </template>
            <!-- columns 为空时，由默认插槽渲染列。 -->
            <template #default>
                <elTableColumn type="selection" :width="55" />
                <elTableColumn prop="id" label="默认插槽：ID" :width="160" />
                <elTableColumn prop="name" label="默认插槽：姓名" :minWidth="220">
                    <template #default="{ row }"
                        ><span class="custom-cell">{{ row.name }}</span></template
                    >
                </elTableColumn>
                <elTableColumn prop="address" label="默认插槽：地址" :minWidth="400" />
            </template>
            <template #tableMainBottom>
                <div class="slot-banner">
                    tableMainBottom：表格下方、分页上方。当前第 {{ pagination.page }} 页，每页
                    {{ pagination.pageSize }} 条，本页 {{ visibleData.length }} 条。
                </div>
            </template>
        </commonTable>

        <section class="event-panel">
            <div class="panel-title">最近一次事件 / 实例检查</div>
            <div class="event-result">{{ lastEvent }}</div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import {
    ElButton as elButton,
    ElForm as elForm,
    ElFormItem as elFormItem,
    ElSwitch as elSwitch,
    ElInput as elInput,
    ElInputNumber as elInputNumber,
    ElSelect as elSelect,
    ElOption as elOption,
    ElTag as elTag,
    ElTableColumn as elTableColumn,
    type TableColumnCtx
} from 'element-plus';
import commonTable from '@/componentsGlobal/commonTable.vue';

/** 测试行字段，直接供表格和插槽读取。 */
interface FileRow {
    /** 行唯一标识。 */
    id: number;
    /** 日期。 */
    date: string;
    /** 姓名。 */
    name: string;
    /** 地址。 */
    address: string;
    /** 年龄，首行使用 0 测试有效假值。 */
    age: number;
    /** 职业，包含空字符串。 */
    job: string;
    /** 布尔值，测试 false 显示。 */
    enabled: boolean;
    /** 备注，包含 null 和 undefined。 */
    remark: string | null | undefined;
}

/** 表格组件实例，通过公开方法获取内部实例。 */
const commonTableRef = ref<InstanceType<typeof commonTable>>();
/** 测试数据直接赋值给列表，26 条用于验证分页及最后一页。 */
const tableData = ref<FileRow[]>(
    Array.from({ length: 26 }, (_, index) => ({
        /** 行唯一标识。 */
        id: index + 1,
        /** 日期字段。 */
        date: `2026-11-${String(index + 1).padStart(2, '0')}`,
        /** 姓名字段。 */
        name: `测试用户${index + 1}`,
        /** 地址字段。 */
        address: `上海市普陀区测试路 ${index + 1} 号，这是一段用于测试溢出提示的较长地址`,
        /** 年龄字段，包含有效值 0。 */
        age: index === 0 ? 0 : 20 + index,
        /** 职业字段，包含空字符串。 */
        job: index % 3 === 0 ? '' : '工程师',
        /** 启用状态，包含有效值 false。 */
        enabled: index % 2 === 1,
        /** 备注字段，包含 null 和 undefined。 */
        remark: index % 3 === 0 ? null : index % 3 === 1 ? undefined : '备注内容'
    }))
);
/** 属性测试开关，不保存额外的模拟列表。 */
const options = reactive({
    /** 加载遮罩。 */
    loading: false,
    /** 搜索空状态。 */
    isSearched: false,
    /** 空表保留高度与横向滚动。 */
    emptyScrollable: true,
    /** 显示内部表格。 */
    isShowColumns: true,
    /** 显示分页。 */
    showPagination: true,
    /** 切换为空数据。 */
    isEmpty: false,
    /** 切换配置列与默认插槽。 */
    useColumns: true,
    /** 切换分页配置别名。 */
    usePaginationAlias: false,
    /** 全局空值占位符。 */
    columnDefaultValue: '--',
    /** 默认列宽。 */
    columnsDefaultMinWidth: 160,
    /** 默认列对齐方式。 */
    columnsDefaultAlign: 'left' as 'left' | 'center' | 'right'
});
/** 分页状态，事件发生后同步更新。 */
const pagination = reactive({
    /** 当前页码。 */
    page: 1,
    /** 每页条数。 */
    pageSize: 5
});
/** 当前勾选数量。 */
const selectedCount = ref(0);
/** 最近一次交互结果。 */
const lastEvent = ref('等待操作。可先勾选数据，或点击“获取表格 / 分页实例”。');

/**
 * 根据空数据开关和分页状态取得当前显示的数据。
 * @returns 当前页数据；关闭分页时返回完整列表。
 * @remarks 无参数；无副作用，不修改源列表。
 */
const visibleData = computed(() => {
    if (options.isEmpty) return [];
    if (!options.showPagination) return tableData.value;
    return tableData.value.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize);
});
/**
 * 生成两种兼容格式的分页配置。
 * @returns 包含总数、页大小、页码和布局的配置。
 * @remarks 无参数；无副作用，total 与实际测试数据一致。
 */
const paginationBind = computed(() => ({
    ...(options.usePaginationAlias
        ? {
              /** Element Plus 风格页码。 */ currentPage: pagination.page /** 兼容的分页布局别名。 */,
              paginationLayout: 'total, sizes, prev, pager, next, jumper'
          }
        : {
              /** 原有风格页码。 */ page: pagination.page /** 分页布局。 */,
              layout: 'total, prev, pager, next, sizes, jumper'
          }),
    /** 每页显示条数。 */
    pageSize: pagination.pageSize,
    /** 与当前数据一致的总条数。 */
    total: options.isEmpty ? 0 : tableData.value.length,
    /** 可选的每页条数。 */
    pageSizes: [5, 10, 20]
}));

/**
 * 演示自定义格式化函数。
 * @param row 当前行。
 * @param column 当前列配置。
 * @param value 当前字段值。
 * @param index 当前页行索引。
 * @returns 带行号的日期文本。
 * @remarks 无副作用。
 */
function formatDate(row: FileRow, column: { prop?: string }, value: string, index: number): string {
    return `${value}（第 ${index + 1} 行，ID ${row.id}，${column.prop}）`;
}

/** 列配置类型直接取公共组件的属性定义。 */
type TableColumns = NonNullable<InstanceType<typeof commonTable>['$props']['columns']>;
/** 配置列涵盖 selection、分组、固定列、插槽、格式化、默认值和默认宽度。 */
const tableColumns = ref<TableColumns>([
    {
        /** 列唯一标识。 */ key: 'selection' /** Element Plus 列属性及空值配置。 */,
        props: {
            /** 列类型。 */ type: 'selection' /** 固定列宽。 */,
            width: 55 /** 固定位置。 */,
            fixed: 'left'
        }
    },
    {
        /** 行字段名。 */
        prop: 'name',
        /** 列显示名称。 */
        label: '姓名',
        /** 公共组件固定位置，1 左侧、2 右侧。 */
        isFixed: 1,
        /** 单元格插槽名称。 */
        slotName: 'nameCell',
        /** 表头插槽名称。 */
        slotHeaderName: 'nameHeader',
        /** Element Plus 列属性及空值配置。 */
        props: {
            /** 最小列宽。 */ minWidth: 260
        }
    },
    {
        /** 列唯一标识。 */
        key: 'profile',
        /** 列显示名称。 */
        label: '分组列',
        /** 分组子列。 */
        children: [
            {
                /** 行字段名。 */
                prop: 'address',
                /** 列显示名称。 */
                label: '地址',
                /** 单元格插槽名称。 */
                slotName: 'addressCell',
                /** 表头插槽名称。 */
                slotHeaderName: 'addressHeader',
                /** Element Plus 列属性及空值配置。 */
                props: {
                    /** 最小列宽。 */ minWidth: 300
                }
            },
            {
                /** 行字段名。 */ prop: 'age' /** 列显示名称。 */,
                label: '年龄（含 0）' /** Element Plus 列属性及空值配置。 */,
                props: {
                    /** 启用本地排序。 */ sortable: true
                }
            }
        ]
    },
    {
        /** 行字段名。 */ prop: 'date' /** 列显示名称。 */,
        label: 'formatter' /** Element Plus 列属性及空值配置。 */,
        props: {
            /** 最小列宽。 */ minWidth: 320 /** 自定义格式化函数。 */,
            formatter: formatDate
        }
    },
    {
        /** 行字段名。 */ prop: 'enabled' /** 列显示名称。 */,
        label: '布尔值（含 false）'
    },
    {
        /** 行字段名。 */ prop: 'job' /** 列显示名称。 */,
        label: '全局占位符'
    },
    {
        /** 行字段名。 */ prop: 'remark' /** 列显示名称。 */,
        label: '列占位符' /** Element Plus 列属性及空值配置。 */,
        props: {
            /** 此列独立的空值占位符。 */ defaultValue: '列自定义空值'
        }
    },
    {
        /** 列唯一标识。 */ key: 'actions' /** 列显示名称。 */,
        label: '操作' /** 公共组件固定位置，1 左侧、2 右侧。 */,
        isFixed: 2 /** 单元格插槽名称。 */,
        slotName: 'actions' /** Element Plus 列属性及空值配置。 */,
        props: {
            /** 固定列宽。 */ width: 130
        }
    }
]);

/**
 * 响应每页条数变化。
 * @param value 新的每页条数。
 * @returns 无返回值。
 * @remarks 更新分页并回到第一页，记录事件。
 */
function handleSizeChange(value: number): void {
    pagination.pageSize = value;
    pagination.page = 1;
    lastEvent.value = `sizeChange：每页 ${value} 条，已回到第一页`;
}
/**
 * 响应当前页变化。
 * @param value 新页码。
 * @returns 无返回值。
 * @remarks 更新当前页并记录事件。
 */
function handleCurrentChange(value: number): void {
    pagination.page = value;
    lastEvent.value = `currentChange：第 ${value} 页`;
}
/**
 * 显示透传的选择事件。
 * @param rows 已勾选行。
 * @returns 无返回值。
 * @remarks 更新选择数量及事件结果。
 */
function handleSelectionChange(rows: FileRow[]): void {
    selectedCount.value = rows.length;
    lastEvent.value = `selectionChange：选中 ID ${rows.map((row) => row.id).join('、') || '无'}`;
}
/**
 * 显示透传的排序事件。
 * @param sort 排序字段和方向。
 * @returns 无返回值。
 * @remarks 更新事件结果；Element Plus 对当前页执行本地排序。
 */
function handleSortChange(sort: { prop: string; order: string | null }): void {
    lastEvent.value = `sortChange：${sort.prop} / ${sort.order ?? '取消排序'}`;
}
/**
 * 显示点击的测试行。
 * @param row 当前行。
 * @returns 无返回值。
 * @remarks 更新事件结果。
 */
function handleRowClick(row: FileRow): void {
    lastEvent.value = `rowClick：ID ${row.id}，${row.name}`;
}
/**
 * 显示透传的列宽拖动事件。
 * @param newWidth 新列宽。
 * @param oldWidth 原列宽。
 * @param column 拖动的列。
 * @param event 鼠标事件。
 * @returns 无返回值。
 * @remarks 更新事件结果。
 */
function handleHeaderDragend(
    newWidth: number,
    oldWidth: number,
    column: TableColumnCtx<FileRow>,
    event: MouseEvent
): void {
    lastEvent.value = `headerDragend：${column.label}，${oldWidth} → ${newWidth}px，鼠标位置 ${event.clientX}`;
}
/**
 * 调用内部表格方法清空选择。
 * @returns 无返回值。
 * @remarks 无参数；清除内部勾选状态并更新事件结果。
 */
function handleClearSelection(): void {
    const tableRef = commonTableRef.value?.getTableRef();
    tableRef?.clearSelection();
    lastEvent.value = tableRef ? 'getTableRef().clearSelection() 已执行' : '表格未显示，无法清空选择';
}
/**
 * 检查自定义 ref 名称下的实例是否可获取。
 * @returns 无返回值。
 * @remarks 无参数；更新事件结果，不修改表格和分页状态。
 */
function handleCheckRefs(): void {
    const tableRef = commonTableRef.value?.getTableRef();
    const paginationRef = commonTableRef.value?.getPaginationRef();
    lastEvent.value = `fileTableRef：${tableRef ? '已获取' : '未渲染'}；filePaginationRef：${
        paginationRef ? '已获取' : '未渲染'
    }（关闭表格或分页、空数据时可复测）`;
}
</script>

<style lang="scss" scoped>
.file-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    .test-panel {
        padding: 16px;
        box-sizing: border-box;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        .panel-title {
            margin-bottom: 12px;
            font-weight: bold;
        }
        .test-controls {
            .align-select {
                width: 120px;
            }
        }
        .test-hint {
            color: var(--el-text-color-secondary);
            font-size: 13px;
            line-height: 1.7;
        }
    }
    .event-panel {
        padding: 16px;
        box-sizing: border-box;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        .panel-title {
            margin-bottom: 10px;
            font-weight: bold;
        }
        .event-result {
            line-height: 1.7;
            overflow-wrap: anywhere;
        }
    }
}
.slot-banner {
    margin: 8px 0;
    padding: 10px 12px;
    box-sizing: border-box;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 13px;
    line-height: 1.6;
}
.tool-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.custom-header {
    color: var(--el-color-primary);
}
.custom-cell {
    color: var(--el-color-success);
}
</style>
