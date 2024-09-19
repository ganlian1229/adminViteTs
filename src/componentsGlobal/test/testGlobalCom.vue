<template>
    <div class="globalCom">
        <p>动态添加的全局组件2</p>
        <ul class="tab-list">
            <li class="tab-item" :class="actIndex === index ? 'act' : ''" v-for="(item, index) in list" :key="index" @click="change(index)">
                {{ item.name }}
            </li>
        </ul>
        <div>
            <component :is="list[actIndex].comments"></component>
        </div>
        <ul>
            <li v-for="(item, index) in dataList" :key="index">
                <span>{{ item.elName }}:</span>
                <component :is="item.elName" v-model="item.value" :options="item.options" @change="handlerChange(index, $event)">
                    <template v-if="item.elName === 'el-select'">
                        <el-option v-for="(option, optionIndex) in item.options" :key="optionIndex" :label="option.label" :value="option.value" />
                    </template>
                </component>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { ElInput, ElSelect, ElOption } from 'element-plus';
export default {
    components: {
        ElInput,
        ElSelect,
        ElOption
    }
};
</script>
<script setup lang="ts">
import testComA from './testComA.vue';
import testComB from './testComB.vue';
import testComC from './testComC.vue';
let actIndex = ref(0);
const list = ref([
    {
        name: 'A',
        comments: markRaw(testComA)
    },
    {
        name: 'B',
        comments: markRaw(testComB)
    },
    {
        name: 'C',
        comments: markRaw(testComC)
    }
]);

function change(index) {
    actIndex.value = index;
}

const dataList = ref([
    {
        elName: 'el-input',
        value: '123456',
        options: {}
    },
    {
        elName: 'el-select',
        value: 'A',
        options: [
            {
                label: '选项A',
                value: 'A'
            },
            {
                label: '选项B',
                value: 'B'
            }
        ]
    }
]);
function handlerChange(index, event) {
    console.log('index', index);
    console.log('event', event);
}
</script>
<style lang="scss" scoped>
.tab-list {
    display: flex;
    .tab-item {
        padding: 0 10px;
        margin: 0 5px;
        cursor: pointer;
        border: 1px solid #000;
        &.act {
            color: red;
        }
    }
}
</style>
