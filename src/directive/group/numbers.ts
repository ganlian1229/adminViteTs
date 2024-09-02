let numbers = {
    // 指令绑定元素挂载前
    beforeMount(el, binding) {
        console.log('beforeMount：el', el);
        console.log('beforeMount：binding', binding);
        console.log('parentNode', el.parentNode);
    },
    // 指令绑定元素挂载后
    mounted(el, binding, vNode) {
        let input = el;
        if (input.tagName !== 'INPUT') {
            input = input.querySelector('input');
        }
        if (!input) return;
        input.addEventListener('compositionstart', () => {
            vNode.inputLocking = true;
        });
        input.addEventListener('compositionend', () => {
            vNode.inputLocking = false;
            input.dispatchEvent(new Event('input'));
        });
        input.addEventListener(
            'input',
            (e) => {
                e.preventDefault(); // 阻止掉默认的change事件
                if (vNode.inputLocking) {
                    return;
                }
                let oldValue = input.value;
                let newValue = input.value;
                newValue = newValue.replace(/[^\d.]/g, '');
                newValue = newValue.replace(/^\./g, '');
                newValue = newValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                const decimal = Number(binding.value) || 2; // 默认两位小数
                const reg = new RegExp(`^(\\-)*(\\d+)\\.(\\d{${decimal}}).*$`);
                newValue = newValue.replace(reg, '$1$2.$3');
                if (newValue) {
                    let arr = newValue.split('.');
                    newValue = Number(arr[0]) + (arr[1] === undefined ? '' : '.' + arr[1]); // 去掉开头多余的0
                }
                // 判断是否需要更新，避免进入死循环
                if (newValue !== oldValue) {
                    input.value = newValue;
                    input.dispatchEvent(new Event('input')); // 通知v-model更新
                }
            },
            true
        );
        // input 事件无法处理小数点后面全是零的情况 因为无法确定用户输入的0是否真的应该清除，如3.02。放在blur中去处理
        input.addEventListener('blur', () => {
            let oldValue = input.value;
            let newValue = input.value;
            if (newValue) {
                newValue = Number(newValue).toString();
            }
            // 判断是否需要更新，避免进入死循环
            if (newValue !== oldValue) {
                input.value = newValue;
                input.dispatchEvent(new Event('input')); // 通知v-model更新
            }
        });
    },
    // 指令绑定元素因为数据修改触发修改前
    beforeUpdate(el, binding) {},
    // 指令绑定元素因为数据修改触发修改后
    updated(el, binding) {},
    // 指令绑定元素销毁前
    beforeUnmount(el, binding) {},
    // 指令绑定元素销毁后
    unmounted(el, binding) {}
};
export default numbers;
