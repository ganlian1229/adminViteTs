let resize = {
    mounted(el, { value }) {
        if (typeof MutationObserver !== 'undefined') {
            // 浏览器支持 MutationObserver
            el.observer = new MutationObserver((mutationsList) => {
                // 在这里处理变化
                // for (const mutation of mutationsList) {
                //     if (mutation.type === 'attributes') {
                //         console.log('监听到属性变化', mutation);
                //     } else if (mutation.type === 'childList') {
                //         console.log('监听到子节点变化');
                //     }
                // }
                value(mutationsList);
            });
            el.observer.observe(el, {
                attributes: true, // 观察属性的变化
                childList: true, // 观察子节点的变化
                subtree: true // 观察所有后代节点的变化
            });
        } else {
            // 浏览器不支持 MutationObserver
            let width = '',
                height = '';
            function isResize() {
                let style = document.defaultView.getComputedStyle(el);
                if (width !== style.width || height !== style.height) {
                    //变化了执行方法
                    value();
                }
                width = style.width;
                height = style.height;
            }
            el.vueSetInterval = setInterval(isResize, 300);
        }
    },
    beforeUnmount(el) {
        if (el.observe) {
            el.observer.disconnect();
        }
        if (el.vueSetInterval) {
            clearInterval(el.vueSetInterval);
        }
    }
};
export default resize;
