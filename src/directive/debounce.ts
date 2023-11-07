const debounce = {
    // 指令绑定元素挂载后
    mounted(el, { value }) {
        let fn, event, time;
        if (typeof value === 'function') {
            fn = value;
            event = 'click';
            time = 500;
        } else if (Array.isArray(value)) {
            fn = value[0];
            event = value[1];
            time = value[2];
        } else {
            console.error('v-debounce用法错误');
        }
        let timer;
        el.addEventListener(event ? event : 'click', () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(
                () => {
                    fn();
                },
                time ? time : 500
            );
        });
    }
};
export default debounce;
