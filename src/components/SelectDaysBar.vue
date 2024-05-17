<!-- 选择天数的选择框 -->
<template>
    <el-select
    v-model="chooseDay"
    filterable
    placeholder="选择展示天数"
    @change="sendDays()"
    :style="{width: barWidth}"
    >
        <el-option
        v-for="(day,i) in chooseDaysStr"
        :key="i"
        :label="`近${day}天内`"
        :value="day"
        />
    </el-select> 
</template>

<script setup>
let props = defineProps({
	barWidth: {
		type: String,
		default(){
			return '10vw'
		}
	},
    chooseDaysStr: {
        type: Array,
        default(){
            return [7,15,30]
        }
    },
    defaultDay: {
        type: Number,
        default(){
            return 7
        }
    }
})
let chooseDay = ref(props.defaultDay)
// 自定义事件
const emit = defineEmits(['change-days'])
// 向父级返回选择的天数
function sendDays(){
	emit('change-days', chooseDay.value);
}

let barWidth = ref(props.barWidth)
</script>

<style lang="scss" scoped>
:deep(){
    .el-select,.el-select__wrapper{
        width: v-bind(barWidth);
    }
}
</style>