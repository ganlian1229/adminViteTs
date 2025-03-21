class GlobalFun {
    globalFilterLabel(
        value: string | Number,
        allArr: any[],
        option?: { label: string; value: string; defaultReturn: string }
    ) {
        option = Object.assign({}, { label: 'label', value: 'value', defaultReturn: '' }, option);
        if (!value && !(value + '')) return option['defaultReturn'] || '';
        if (!allArr || !allArr.length) return option['defaultReturn'] || '';
        const obj = allArr.find((item) => item[option.value] === value);
        if (obj) {
            return obj[option.label];
        }
        return option['defaultReturn'] || '';
    }
    globalTest() {
        return 'globalTest';
    }
}
const globalFun = new GlobalFun();

export default globalFun;
