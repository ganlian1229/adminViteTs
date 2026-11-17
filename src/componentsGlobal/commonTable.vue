<template>
    <div
        class="common-table"
        :style="($attrs.style as StyleValue)"
        :class="[
            $attrs.class,
            {
                'is-empty': data.length <= 0,
                'is-empty-scrollable': emptyScrollable && data.length <= 0
            }
        ]"
    >
        <div class="table-inner">
            <slot name="tableMainTop"></slot>
            <div class="table-main">
                <div class="tool-box" v-if="$slots['toolLeft'] || $slots['toolRight']">
                    <div class="tool-left">
                        <slot name="toolLeft"></slot>
                    </div>
                    <div class="tool-right">
                        <slot name="toolRight"></slot>
                    </div>
                </div>
                <slot name="toolTableMiddle"></slot>
                <div class="table-box" v-loading="loading">
                    <template v-if="isShowColumns">
                        <elTable class="data-table" v-bind="getTableBind()" :ref="tableRef" style="width: 100%">
                            <!-- 优先使用 columns 自动生成列；并支持父组件通过具名插槽覆盖某列：由 column.slotName 指定 -->
                            <template v-if="columns && columns.length">
                                <template
                                    v-for="(col, colIndex) in columns"
                                    :key="col.key || col.prop || col.slotName || colIndex"
                                >
                                    <!-- 嵌套列 -->
                                    <elTableColumn
                                        v-if="col.children && col.children.length"
                                        :label="col.label"
                                        :fixed="
                                            col.isFixed
                                                ? col.isFixed === 1
                                                    ? 'left'
                                                    : col.isFixed === 2
                                                    ? 'right'
                                                    : false
                                                : col.props && col.props.fixed
                                                ? col.props.fixed
                                                : false
                                        "
                                        v-bind="col.props && Object.keys(col.props).length > 0 ? col.props : {}"
                                    >
                                        <template
                                            v-for="(child, childIndex) in col.children"
                                            :key="child.key || child.prop || child.slotName || childIndex"
                                        >
                                            <!-- 非 selection 类型 -->
                                            <elTableColumn
                                                v-if="!(child.props && child.props.type === 'selection')"
                                                :minWidth="
                                                    child.props && child.props.minWidth
                                                        ? child.props.minWidth
                                                        : columnsDefaultMinWidth
                                                "
                                                :align="
                                                    child.props && child.props.align
                                                        ? child.props.align
                                                        : columnsDefaultAlign
                                                "
                                                :label="child.label"
                                                :prop="child.prop"
                                                :fixed="
                                                    child.isFixed
                                                        ? child.isFixed === 1
                                                            ? 'left'
                                                            : child.isFixed === 2
                                                            ? 'right'
                                                            : false
                                                        : child.props && child.props.fixed
                                                        ? child.props.fixed
                                                        : false
                                                "
                                                v-bind="
                                                    child.props && Object.keys(child.props).length > 0
                                                        ? child.props
                                                        : {}
                                                "
                                            >
                                                <template
                                                    #header
                                                    v-if="child.slotHeaderName && $slots[child.slotHeaderName]"
                                                >
                                                    <slot :name="child.slotHeaderName" v-bind="child"></slot>
                                                </template>
                                                <template #default="scope">
                                                    <slot
                                                        v-if="child.slotName && $slots[child.slotName]"
                                                        :name="child.slotName"
                                                        v-bind="scope"
                                                        :col="child"
                                                    />
                                                    <template v-else>
                                                        {{ handleFormatter(scope, child) }}
                                                    </template>
                                                </template>
                                            </elTableColumn>
                                            <!-- selection 类型 -->
                                            <elTableColumn
                                                v-else
                                                :minWidth="
                                                    child.props && child.props.minWidth
                                                        ? child.props.minWidth
                                                        : columnsDefaultMinWidth
                                                "
                                                :align="
                                                    child.props && child.props.align
                                                        ? child.props.align
                                                        : columnsDefaultAlign
                                                "
                                                :label="child.label"
                                                :prop="child.prop"
                                                :fixed="
                                                    child.isFixed
                                                        ? child.isFixed === 1
                                                            ? 'left'
                                                            : child.isFixed === 2
                                                            ? 'right'
                                                            : false
                                                        : child.props && child.props.fixed
                                                        ? child.props.fixed
                                                        : false
                                                "
                                                v-bind="
                                                    child.props && Object.keys(child.props).length > 0
                                                        ? child.props
                                                        : {}
                                                "
                                            />
                                        </template>
                                    </elTableColumn>
                                    <!-- 非 selection 类型：单层列 -->
                                    <elTableColumn
                                        v-else-if="!(col.props && col.props.type === 'selection')"
                                        :minWidth="
                                            col.props && col.props.minWidth
                                                ? col.props.minWidth
                                                : columnsDefaultMinWidth
                                        "
                                        :align="col.props && col.props.align ? col.props.align : columnsDefaultAlign"
                                        :label="col.label"
                                        :prop="col.prop"
                                        :fixed="
                                            col.isFixed
                                                ? col.isFixed === 1
                                                    ? 'left'
                                                    : col.isFixed === 2
                                                    ? 'right'
                                                    : false
                                                : col.props && col.props.fixed
                                                ? col.props.fixed
                                                : false
                                        "
                                        v-bind="col.props && Object.keys(col.props).length > 0 ? col.props : {}"
                                    >
                                        <template #header v-if="col.slotHeaderName && $slots[col.slotHeaderName]">
                                            <slot :name="col.slotHeaderName" v-bind="col"></slot>
                                        </template>
                                        <template #default="scope">
                                            <slot
                                                v-if="col.slotName && $slots[col.slotName]"
                                                :name="col.slotName"
                                                v-bind="scope"
                                                :col="col"
                                            />
                                            <template v-else>
                                                {{ handleFormatter(scope, col) }}
                                            </template>
                                        </template>
                                    </elTableColumn>
                                    <!-- selection 类型：直接渲染，不带 default 插槽 -->
                                    <elTableColumn
                                        v-else
                                        :minWidth="
                                            col.props && col.props.minWidth
                                                ? col.props.minWidth
                                                : columnsDefaultMinWidth
                                        "
                                        :align="col.props && col.props.align ? col.props.align : columnsDefaultAlign"
                                        :label="col.label"
                                        :prop="col.prop"
                                        v-bind="col.props && Object.keys(col.props).length > 0 ? col.props : {}"
                                    />
                                </template>
                            </template>
                            <!-- 没传 columns 的时候，仍兼容旧写法：外部自己写 elTableColumn -->
                            <slot v-else />

                            <template v-if="emptyScrollable" #empty>
                                <div class="empty-box is-in-table">
                                    <div class="empty-text">暂无数据</div>
                                </div>
                            </template>
                        </elTable>
                    </template>
                    <template v-if="data.length <= 0 && !emptyScrollable">
                        <!-- 数据为空 -->
                        <div v-if="!isSearched" class="empty-box">
                            <div class="empty-text">暂无数据</div>
                        </div>
                        <!-- 搜索数据为空 -->
                        <div v-if="isSearched" class="empty-box">
                            <div class="empty-text">暂无数据</div>
                        </div>
                    </template>
                </div>
            </div>
            <slot name="tableMainBottom"></slot>
            <div class="pagination-box" v-if="showPagination && data.length > 0">
                <elPagination
                    :ref="paginationRef"
                    v-bind="paginationBind"
                    @sizeChange="handleSizeChange"
                    @currentChange="handleCurrentChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// 项目 ESLint 继承了 Vue 2 的 key 规则；此组件按 Vue 3 要求将 key 放在 v-for 的 template 上。
/* eslint vue/no-v-for-template-key: "off", vue/no-v-for-template-key-on-child: "error" */
import { computed, getCurrentInstance, useAttrs, type PropType, type StyleValue } from 'vue';
import {
    ElTable as elTable,
    ElTableColumn as elTableColumn,
    ElPagination as elPagination,
    vLoading,
    type TableInstance
} from 'element-plus';
import 'element-plus/es/components/table/style/css';
import 'element-plus/es/components/table-column/style/css';
import 'element-plus/es/components/pagination/style/css';
import 'element-plus/es/components/loading/style/css';

/** 表格行数据；字段直接使用业务接口返回值。 */
type TableRow = Record<string, any>;

/** 配置列及分组子列，保留原有配置接口。 */
interface CommonTableColumn {
    /** 行字段路径。 */
    prop?: string;
    /** 列唯一标识。 */
    key?: string | number;
    /** 列标题。 */
    label?: string;
    /** 单元格插槽名。 */
    slotName?: string;
    /** 表头插槽名。 */
    slotHeaderName?: string;
    /** 固定位置：1 为左侧，2 为右侧。 */
    isFixed?: number;
    /** Element Plus 列属性、formatter 和空值占位符。 */
    props?: Record<string, any>;
    /** 分组子列。 */
    children?: CommonTableColumn[];
}

/** 分页配置，兼容原有 page 和 currentPage 两种页码配置。 */
interface TablePagination {
    /** 当前页码。 */
    page?: number;
    /** Element Plus 当前页码。 */
    currentPage?: number;
    /** 每页条数。 */
    pageSize?: number;
    /** 总条数。 */
    total?: number;
    /** 可选每页条数。 */
    pageSizes?: number[];
    /** 分页布局。 */
    layout?: string;
    /** 原有分页布局别名。 */
    paginationLayout?: string;
}

defineOptions({ name: 'commonTable', inheritAttrs: false });

/** 组件输入，保留原表格及分页配置。 */
const props = defineProps({
    /** 表格行数据。 */
    data: { type: Array as PropType<TableRow[]>, default: () => [] },
    /** 表格加载状态。 */
    loading: { type: Boolean, default: false },
    /** 是否已进行搜索，兼容原有调用。 */
    isSearched: { type: Boolean, default: false },
    /** 空数据时是否保留表体高度和横向滚动条。 */
    emptyScrollable: { type: Boolean, default: false },
    /** 列配置，支持分组列和具名插槽。 */
    columns: { type: Array as PropType<CommonTableColumn[]>, default: () => [] },
    /** 单元格空值占位符。 */
    columnDefaultValue: { type: String, default: '--' },
    /** 列默认最小宽度。 */
    columnsDefaultMinWidth: { type: Number, default: 160 },
    /** 列默认对齐方式。 */
    columnsDefaultAlign: { type: String as PropType<'left' | 'center' | 'right'>, default: 'center' },
    /** 是否渲染表格及表头。 */
    isShowColumns: { type: Boolean, default: true },
    /** 是否显示分页。 */
    showPagination: { type: Boolean, default: true },
    /** 分页配置；页码变化后由调用方更新配置并加载数据。 */
    pagination: { type: Object as PropType<TablePagination>, default: () => ({}) },
    /** 表格实例的引用名称。 */
    tableRef: { type: String, default: 'tableDomRef' },
    /** 分页实例的引用名称。 */
    paginationRef: { type: String, default: 'paginationDomRef' }
});

/** 分页事件；其他监听器透传至内部表格。 */
const emit = defineEmits<{
    /** 每页条数变化。 */
    (event: 'sizeChange', value: number): void;
    /** 当前页码变化。 */
    (event: 'currentChange', value: number): void;
}>();

/** 未在 props 中声明的表格属性和事件。 */
const attrs = useAttrs();
/** 当前组件实例，用于读取可配置名称的内部模板引用。 */
const componentRef = getCurrentInstance();

/**
 * 组装表格属性与监听器。
 * @returns Element Plus 表格参数。
 * @remarks 无参数；无副作用；每次渲染读取最新 attrs，避免缓存非响应式的 useAttrs 对象。
 */
function getTableBind(): Record<string, any> {
    const { fixedScroll, auth, hasAuth, class: rootClass, style: rootStyle, ...rest } = attrs;
    return { stripe: true, tooltipEffect: 'dark', ...rest, data: props.data };
}

/**
 * 补齐分页默认参数。
 * @returns Element Plus 分页绑定参数。
 * @remarks 无参数；不修改调用方传入的分页对象。
 */
const paginationBind = computed(() => ({
    currentPage: props.pagination.currentPage ?? props.pagination.page ?? 1,
    pageSize: props.pagination.pageSize ?? 10,
    total: props.pagination.total ?? 0,
    pageSizes: props.pagination.pageSizes ?? [10, 20, 30, 40, 50, 100, 200],
    layout: props.pagination.layout ?? props.pagination.paginationLayout ?? 'total, prev, pager, next, sizes, jumper'
}));

/**
 * 获取内部表格实例。
 * @returns 已挂载的表格实例，未渲染时为 undefined。
 * @remarks 无参数；无副作用。
 */
function getTableRef(): TableInstance | undefined {
    return componentRef?.refs[props.tableRef] as TableInstance | undefined;
}
/**
 * 获取内部分页实例。
 * @returns 已挂载的分页实例，未渲染时为 undefined。
 * @remarks 无参数；无副作用。
 */
function getPaginationRef(): InstanceType<typeof elPagination> | undefined {
    return componentRef?.refs[props.paginationRef] as InstanceType<typeof elPagination> | undefined;
}
/**
 * 格式化单元格，保留 0 和 false 等有效值。
 * @param scope 表格传入的行、列和行索引。
 * @param col 当前业务列配置。
 * @returns 格式化后的内容或空值占位符。
 * @remarks 自身不修改数据；自定义 formatter 的行为由调用方控制。
 */
function handleFormatter(scope: { row: TableRow; $index: number }, col: CommonTableColumn): any {
    // 与 Element Plus 一致，支持 prop 中的嵌套字段路径。
    const value = col.prop?.split('.').reduce((row, key) => row?.[key], scope.row);
    if (typeof col.props?.formatter === 'function') {
        return col.props.formatter(scope.row, col, value, scope.$index);
    }
    return value === null || value === undefined || value === ''
        ? col.props?.defaultValue ?? props.columnDefaultValue
        : value;
}
/**
 * 通知调用方每页条数变化。
 * @param val 新的每页条数。
 * @returns 无返回值。
 * @remarks 抛出 sizeChange 事件，不修改分页配置。
 */
function handleSizeChange(val: number): void {
    emit('sizeChange', val);
}
/**
 * 通知调用方当前页变化。
 * @param val 新的当前页码。
 * @returns 无返回值。
 * @remarks 抛出 currentChange 事件，不修改分页配置。
 */
function handleCurrentChange(val: number): void {
    emit('currentChange', val);
}

// 保留父组件通过组件 ref 获取内部实例的接口。
defineExpose({ getTableRef, getPaginationRef });
</script>

<style lang="scss" scoped>
.common-table {
    min-width: 0;
    font-variant-numeric: tabular-nums;
    &.is-empty:not(.is-empty-scrollable) {
        :deep(.el-table) {
            height: auto !important;
            max-height: none !important;
        }
        :deep(.el-table__body-wrapper) {
            height: 0 !important;
            min-height: 0 !important;
            overflow: hidden !important;
        }
    }
    .table-inner {
        padding: 0;
        box-sizing: border-box;
        .table-main {
            .tool-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
                padding-bottom: 16px;
                box-sizing: border-box;
            }
            .table-box {
                .data-table {
                    --el-table-header-bg-color: #ffffff;
                    --el-table-header-text-color: var(--app-muted, #68767e);
                    --el-table-row-hover-bg-color: #f5f8f9;
                    :deep(.el-table__cell) {
                        padding: 14px 0;
                        box-sizing: border-box;
                    }
                    :deep(.el-table__empty-block) {
                        position: sticky;
                        left: 0;
                        width: 100% !important;
                    }
                }
            }
        }
        .pagination-box {
            display: flex;
            justify-content: flex-end;
            padding-top: 20px;
            box-sizing: border-box;
            overflow-x: auto;
        }
    }
}
.empty-box {
    width: 100%;
    min-height: 260px;
    text-align: center;
    padding: 100px 20px 40px;
    box-sizing: border-box;
    &.is-in-table {
        min-height: 0;
        padding-top: 0;
        box-sizing: border-box;
    }
    .empty-text {
        color: var(--app-muted, #68767e);
        font-size: 14px;
    }
}
</style>
