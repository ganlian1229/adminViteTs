# 公共表格组件 commonTable

- 组件位置：`src/componentsGlobal/commonTable.vue`，使用 Vue 3 `<script setup lang="ts">` 和 Element Plus。
- 新增或调整普通列表表格时优先复用 `commonTable`；接入前检查组件当前实现和页面业务，保留原有事件与展示行为。
- 使用标签 `<commonTable />`，属性及事件名称使用 camelCase。组件位于自动导入目录，也可显式导入。
- 完整手动测试示例：`src/views/articleAdmin/articleUser/fileList.vue`，包含属性开关、配置列、插槽、事件结果和实例检查。该页面目前使用测试数据，接入真实业务时不要直接照搬模拟内容。

## 属性

| 属性 | 默认值 | 用途 |
| --- | --- | --- |
| `data` | `[]` | 当前显示的行数据，直接使用业务字段。 |
| `loading` | `false` | 表格区域加载遮罩。 |
| `isSearched` | `false` | 标记搜索空状态；当前搜索前后均显示“暂无数据”。 |
| `emptyScrollable` | `false` | 空数据时保留表体高度与横向滚动，方便查看宽表头。 |
| `columns` | `[]` | 配置列；为空时使用默认插槽手写列。 |
| `columnDefaultValue` | `'--'` | 普通配置列的空值占位符。 |
| `columnsDefaultMinWidth` | `160` | 未单独指定 minWidth 的列使用的最小宽度。 |
| `columnsDefaultAlign` | `'center'` | 默认对齐方式，支持 left、center、right。 |
| `isShowColumns` | `true` | 控制整个内部表格是否渲染，不只是表头。 |
| `showPagination` | `true` | 控制分页显示；data 为空时不会渲染分页。 |
| `pagination` | `{}` | 分页配置，具体默认值见下文。 |
| `tableRef` | `'tableDomRef'` | 内部表格的模板引用名称，名称应以 Ref 结尾。 |
| `paginationRef` | `'paginationDomRef'` | 内部分页的模板引用名称，名称应以 Ref 结尾。 |

## 列配置

- 普通列使用 `{ prop, label, key?, props? }`，列宽、对齐、排序、selection 等 Element Plus 列属性放入 `props`，例如 `{ prop: 'name', label: '姓名', props: { minWidth: 180 } }`。
- 分组列使用 `{ label, children: [...] }`；当前模板支持一层分组及其子列，未实现任意层递归。
- 普通配置列和分组子列可通过 `isFixed: 1` 固定到左侧、`isFixed: 2` 固定到右侧，也可使用 `props.fixed`。selection 列建议通过 `props: { type: 'selection', fixed: 'left' }` 配置。
- `slotName` 指定单元格插槽名，插槽参数包含 Element Plus 的作用域参数（如 row、column、$index）及业务列配置 `col`。
- `slotHeaderName` 指定普通列或分组子列的表头插槽名，插槽参数直接展开当前业务列配置，例如 `#nameHeader="{ label }"`。
- `props.formatter(row, col, value, index)` 可格式化单元格，第二个参数为业务列配置。
- 没有自定义单元格插槽或 formatter 时，null、undefined、空字符串使用 `props.defaultValue ?? columnDefaultValue`；0 和 false 保留原值。普通单元格支持通过 prop 的点路径读取嵌套字段。
- 默认插槽手写列时，由 Element Plus 和调用方负责列渲染及格式化，不自动应用上述配置列的格式化逻辑。

## 插槽

| 插槽 | 位置 / 用法 |
| --- | --- |
| `tableMainTop` | 表格主体上方。 |
| `toolLeft` | 工具栏左侧；提供任一工具栏插槽时才渲染工具栏。 |
| `toolRight` | 工具栏右侧。 |
| `toolTableMiddle` | 工具栏与表格之间。 |
| `tableMainBottom` | 表格主体下方、分页上方。 |
| 默认插槽 | columns 为空时放置 elTableColumn。 |
| `columns[].slotName` | 自定义单元格；分组子列同样支持。 |
| `columns[].slotHeaderName` | 自定义普通列或分组子列表头。 |

## 分页、事件与实例

- `pagination` 支持 `currentPage` 或 `page`（优先 currentPage，默认 1）、`pageSize`（默认 10）、`total`（默认 0）、`pageSizes`（默认 [10, 20, 30, 40, 50, 100, 200]）、`layout` 或 `paginationLayout`（优先 layout，默认 total, prev, pager, next, sizes, jumper）。
- 使用 `@sizeChange` 和 `@currentChange` 接收分页变化。组件不修改传入的分页对象，不自动请求接口或截取 data；调用方负责更新页码、每页条数、总数及当前页数据。
- 未声明的表格属性与事件由 `getTableBind()` 从 `useAttrs()` 获取，并通过 `v-bind` 透传到内部 elTable。例如 `border`、`height`、`rowKey`、`@selectionChange`、`@sortChange`、`@rowClick`、`@headerDragend`。Vue 3 不再使用 `$listeners`；分页事件由组件单独声明和抛出。
- `class`、`style` 应用于公共组件根容器，不是内部 elTable；调整内部表格样式前应先检查实际 DOM。
- 父组件设置 `ref="commonTableRef"` 后，通过 `commonTableRef.value?.getTableRef()` 获取内部表格实例，通过 `commonTableRef.value?.getPaginationRef()` 获取内部分页实例。
- 调用实例方法前检查实例是否存在；表格或分页未渲染时可能取不到实例。例如 `commonTableRef.value?.getTableRef()?.clearSelection()`。
