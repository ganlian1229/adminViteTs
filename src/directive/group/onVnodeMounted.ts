export default {
    // 指令绑定元素挂载后
    mounted(el, binding, vnode) {
        // console.log('mounted：el', el);
        // console.log('mounted：binding', binding);
        // console.log('mounted：vnode', vnode);
        // console.log('parentNode', el.parentNode);
        binding.value && binding.value();
    }
};
