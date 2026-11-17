<template>
    <div class="home-page">
        <div class="page-heading">
            <div class="heading-copy">
                <h1 class="page-title">工作台</h1>
                <p class="page-description">从一个清晰的起点，开始构建你的下一个项目。</p>
            </div>
            <el-button type="primary" @click="router.push('/articleAdmin/articleUser/fileList')"
                >查看组件示例<el-icon class="action-icon"><Right /></el-icon
            ></el-button>
        </div>
        <section class="overview-strip" aria-label="模板能力概览">
            <div class="overview-item">
                <span class="metric-label">导航模块</span
                ><span class="metric-value">{{ modules.length }}<span class="metric-unit">个</span></span
                ><span class="metric-note">按业务模块组织</span>
            </div>
            <div class="overview-item">
                <span class="metric-label">可访问页面</span
                ><span class="metric-value">{{ pages.length }}<span class="metric-unit">页</span></span
                ><span class="metric-note">来自当前路由配置</span>
            </div>
            <div class="overview-item">
                <span class="metric-label">公共组件</span
                ><span class="metric-value">{{ componentCount }}<span class="metric-unit">个</span></span
                ><span class="metric-note">表格、抽屉与弹窗等</span>
            </div>
            <div class="overview-item">
                <span class="metric-label">自定义指令</span
                ><span class="metric-value">{{ directiveCount }}<span class="metric-unit">项</span></span
                ><span class="metric-note">覆盖常用交互场景</span>
            </div>
        </section>
        <div class="workspace-grid">
            <section class="module-section">
                <div class="section-heading">
                    <h2 class="section-title">模块导航</h2>
                    <el-input
                        v-model="keyword"
                        class="module-search"
                        placeholder="查找页面"
                        clearable
                        aria-label="查找页面"
                        ><template #prefix
                            ><el-icon><Search /></el-icon></template
                    ></el-input>
                </div>
                <div class="module-list">
                    <router-link v-for="page in filteredPages" :key="page.path" class="module-row" :to="page.path"
                        ><el-icon class="module-icon"><component :is="page.icon || 'Document'" /></el-icon>
                        <div class="module-copy">
                            <span class="module-title">{{ page.title }}</span
                            ><span class="module-caption">{{ page.group }}</span>
                        </div>
                        <el-icon class="module-arrow"><ArrowRight /></el-icon
                    ></router-link>
                    <el-empty
                        v-if="!filteredPages.length"
                        description="没有匹配的页面，请尝试其他关键词"
                        :imageSize="64"
                    />
                </div>
            </section>
            <aside class="resource-column">
                <section class="starter-panel">
                    <h2 class="section-title">开始使用</h2>
                    <p class="panel-description">基础能力已就绪，按需组合你的业务页面。</p>
                    <div class="guide-list">
                        <div class="guide-item">
                            <el-icon class="guide-icon"><Check /></el-icon>
                            <div class="guide-copy">
                                <h3 class="guide-title">搭建页面</h3>
                                <p class="guide-description">配置路由，自动生成侧栏导航与访问标签。</p>
                            </div>
                        </div>
                        <div class="guide-item">
                            <el-icon class="guide-icon"><Check /></el-icon>
                            <div class="guide-copy">
                                <h3 class="guide-title">复用组件</h3>
                                <p class="guide-description">统一表格、分页、抽屉和弹窗交互。</p>
                            </div>
                        </div>
                        <div class="guide-item">
                            <el-icon class="guide-icon"><Check /></el-icon>
                            <div class="guide-copy">
                                <h3 class="guide-title">连接业务</h3>
                                <p class="guide-description">使用现有请求封装与 Pinia 状态管理。</p>
                            </div>
                        </div>
                    </div>
                    <el-button class="guide-button" @click="router.push('/articleAdmin/articleUser/fileList')"
                        >打开公共组件演示<el-icon class="action-icon"><TopRight /></el-icon
                    ></el-button>
                </section>
                <section class="project-panel">
                    <div class="section-heading">
                        <h2 class="section-title">项目概览</h2>
                        <span class="project-label">模板</span>
                    </div>
                    <div class="project-facts">
                        <div class="fact-row">
                            <span class="fact-label">框架</span
                            ><span>Vue {{ packageInfo.dependencies.vue.replace('^', '') }}</span>
                        </div>
                        <div class="fact-row">
                            <span class="fact-label">构建工具</span><span>Vite + TypeScript</span>
                        </div>
                        <div class="fact-row"><span class="fact-label">组件库</span><span>Element Plus</span></div>
                        <div class="fact-row">
                            <span class="fact-label">版本</span><span>{{ packageInfo.version }}</span>
                        </div>
                    </div>
                    <p class="project-note">当前展示模板能力，尚未接入业务统计。</p>
                </section>
            </aside>
        </div>
        <section class="demo-section">
            <el-collapse v-model="demoPanels"
                ><el-collapse-item name="directives"
                    ><template #title
                        ><div class="demo-heading">
                            <el-icon><Operation /></el-icon><span>交互与指令演示</span
                            ><span class="demo-hint">展开体验模板交互</span>
                        </div></template
                    ><directiveDemo v-if="demoPanels.includes('directives')" /></el-collapse-item
            ></el-collapse>
        </section>
        <footer class="page-footer"><span>Admin Vite TS</span><span>简洁的界面，专注的工作。</span></footer>
    </div>
</template>
<script setup lang="ts">
import dynamicRouter from '@/router/dynamicRouter';
import packageInfo from '../../../package.json';
import directiveDemo from './components/directiveDemo.vue';
/** 当前路由操作实例。 */
const router = useRouter();
/** 可见的顶层导航模块。 */
const modules = dynamicRouter.filter((item) => item.meta.show);
/** 导航入口的数据形状。 */
interface PageEntry {
    /** 完整路由路径。 */ path: string;
    /** 页面标题。 */ title: string;
    /** 所属模块名称。 */ group: string;
    /** 导航图标。 */ icon?: string;
}
/** 从现有路由生成页面列表；routes 为路由树，parentPath 为父路径，group 为模块标题；返回入口数组；不修改路由。 */
function collectPages(routes, parentPath = '', group = ''): PageEntry[] {
    return routes.flatMap((item) => {
        if (!item.meta?.show) return [];
        const path = `${parentPath}/${item.path}`.replace(/\/+/g, '/');
        if (item.children?.length) return collectPages(item.children, path, item.meta.title);
        return [{ path, title: item.meta.title, group, icon: item.meta.icon }];
    });
}
/** 从路由配置计算的所有可见页面。 */
const pages = collectPages(dynamicRouter);
/** 公共组件数量，不含测试目录。 */
const componentCount = Object.keys(import.meta.glob('/src/componentsGlobal/*.vue')).length;
/** 指令文件数量。 */
const directiveCount = Object.keys(import.meta.glob('/src/directive/group/*.ts')).length;
/** 模块搜索关键词。 */
const keyword = ref('');
/** 根据标题或模块名称过滤页面；只读，不修改配置。 */
const filteredPages = computed(() =>
    pages.filter((page) => `${page.title}${page.group}`.toLowerCase().includes(keyword.value.trim().toLowerCase()))
);
/** 当前展开的指令演示面板。 */
const demoPanels = ref<string[]>([]);
</script>
<style lang="scss" scoped>
.home-page {
    .page-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 28px;
        .heading-copy {
            .page-title {
                font-size: 24px;
                line-height: 1.4;
                font-weight: bold;
                margin: 0 0 8px;
            }
            .page-description {
                color: var(--app-muted);
                font-size: 14px;
                line-height: 1.7;
                margin: 0;
            }
        }
    }
    .overview-strip {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        border: 1px solid var(--app-border);
        border-radius: 8px;
        margin-bottom: 28px;
        .overview-item {
            padding: 18px 24px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-right: 1px solid var(--app-border);
            &:last-child {
                border-right: 0;
            }
            .metric-label {
                color: var(--app-muted);
                font-size: 13px;
            }
            .metric-value {
                font-size: 30px;
                line-height: 1.2;
                font-variant-numeric: tabular-nums;
                .metric-unit {
                    font-size: 12px;
                    color: var(--app-muted);
                    margin-left: 8px;
                }
            }
            .metric-note {
                color: var(--app-muted);
                font-size: 13px;
            }
        }
    }
    // 可用宽度分为 7:4 两列，统一 24px 间距，模块与资源区左右边界闭合。
    .workspace-grid {
        display: grid;
        grid-template-columns: minmax(0, 7fr) minmax(280px, 4fr);
        gap: 24px;
        align-items: start;
        .module-section {
            min-width: 0;
            .section-heading {
                .module-search {
                    width: 190px;
                }
            }
            .module-list {
                .module-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    min-height: 48px;
                    padding: 9px 4px;
                    box-sizing: border-box;
                    border-bottom: 1px solid var(--app-border);
                    color: var(--app-ink);
                    text-decoration: none;
                    &:hover {
                        background: #f6f8f9;
                    }
                    &:focus-visible {
                        outline: 2px solid var(--app-accent);
                        outline-offset: 2px;
                    }
                    .module-icon {
                        color: var(--app-muted);
                        font-size: 18px;
                        flex-shrink: 0;
                    }
                    .module-copy {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        flex: 1;
                        min-width: 0;
                        .module-title {
                            font-size: 14px;
                        }
                        .module-caption {
                            font-size: 12px;
                            color: var(--app-muted);
                            margin-left: auto;
                        }
                    }
                    .module-arrow {
                        color: #8c9aa2;
                        font-size: 13px;
                    }
                }
            }
        }
        .resource-column {
            display: flex;
            flex-direction: column;
            gap: 24px;
            .starter-panel {
                background: #f4f7f8;
                padding: 22px;
                box-sizing: border-box;
                border-radius: 8px;
                .panel-description {
                    color: var(--app-muted);
                    font-size: 13px;
                    line-height: 1.8;
                    margin: 10px 0 24px;
                }
                .guide-list {
                    display: flex;
                    flex-direction: column;
                    gap: 22px;
                    .guide-item {
                        display: flex;
                        gap: 12px;
                        .guide-icon {
                            color: var(--app-accent);
                            margin-top: 2px;
                        }
                        .guide-copy {
                            .guide-title {
                                font-size: 13px;
                                font-weight: bold;
                                margin: 0 0 6px;
                            }
                            .guide-description {
                                font-size: 13px;
                                color: var(--app-muted);
                                line-height: 1.7;
                                margin: 0;
                            }
                        }
                    }
                }
                .guide-button {
                    margin-top: 24px;
                    width: 100%;
                    background: #fff;
                }
            }
            .project-panel {
                padding: 0 4px;
                box-sizing: border-box;
                .section-heading {
                    .project-label {
                        font-size: 11px;
                        background: var(--app-frame);
                        padding: 3px 7px;
                        box-sizing: border-box;
                        border-radius: 4px;
                        color: var(--app-muted);
                    }
                }
                .project-facts {
                    .fact-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 13px;
                        margin-top: 16px;
                        .fact-label {
                            color: var(--app-muted);
                        }
                    }
                }
                .project-note {
                    color: var(--app-muted);
                    font-size: 12px;
                    margin: 20px 0 0;
                }
            }
        }
    }
    .demo-section {
        margin-top: 28px;
        .demo-heading {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            .demo-hint {
                font-size: 12px;
                color: var(--app-muted);
                font-weight: normal;
                margin-left: 8px;
            }
        }
    }
    .page-footer {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: var(--app-muted);
        font-size: 11px;
        margin-top: 24px;
    }
}
.section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}
.section-title {
    font-size: 15px;
    font-weight: bold;
    margin: 0;
}
.action-icon {
    margin-left: 8px;
}
@media (max-width: 760px) {
    .home-page {
        .page-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
        }
        .overview-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            .overview-item {
                padding: 18px;
                box-sizing: border-box;
                &:nth-child(2) {
                    border-right: 0;
                }
                &:nth-child(-n + 2) {
                    border-bottom: 1px solid var(--app-border);
                }
            }
        }
        .workspace-grid {
            grid-template-columns: 1fr;
            .module-section {
                .module-list {
                    .module-row {
                        .module-copy {
                            .module-caption {
                                max-width: 120px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                }
            }
        }
        .demo-section {
            .demo-heading {
                .demo-hint {
                    display: none;
                }
            }
        }
    }
}
</style>
