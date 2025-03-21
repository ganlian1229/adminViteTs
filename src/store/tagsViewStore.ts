import { defineStore } from 'pinia';
const tagsViewStore = defineStore('tagsView', {
    state: () => ({
        visitedViews: [],
        cachedViews: []
    }),
    getters: {},
    actions: {
        // 添加缓存标签
        addCacheView(view) {
            if (this.cachedViews.includes(view.name)) return;
            this.cachedViews.push(view.name);
        },
        // 删除缓存标签
        deleteCachedView(view) {
            const index = this.cachedViews.indexOf(view.name);
            index > -1 && this.cachedViews.splice(index, 1);
        },
        // 添加标签
        addView(view) {
            if (this.visitedViews.some((v) => v.path === view.path)) return;
            this.visitedViews.push({
                ...view,
                title: view.meta.title || 'no-name'
            });
            if (!view.noCache) {
                this.addCacheView(view);
            }
        },
        // 关闭标签
        closeView(view) {
            this.visitedViews = this.visitedViews.filter((item) => item.path !== view.path);
            this.deleteCachedView(view);
        },
        // 关闭多个标签
        closeMultipleView(viewArr) {
            if (!viewArr?.length) return;
            // 移除在viewArr中的标签
            this.visitedViews = this.visitedViews.filter((item) => viewArr.every((ite) => ite.path != item.path));
            viewArr.forEach((item) => {
                // 移除缓存
                this.deleteCachedView(item);
            });
        }
    }
    // persist: {
    //     enabled: true
    // }
});
export default tagsViewStore;
