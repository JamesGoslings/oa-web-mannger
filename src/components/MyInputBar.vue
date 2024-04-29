<template>
    <span class="iptBox">
        <div class="ico iconfont">&#xe740;</div>
        <input class="ipt" type="text" :placeholder="text" 
        :value="modelValue"  
        @input="updateValue"  
        @keyup.enter="handleEnter"/>
    </span>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  fontColor: {
    type: String,
    default: 'rgb(194,202,226)'
  },
  holderColor: {
    type: String,
    default: 'rgb(194,202,226)'
  },
  // 输入框内部的背景颜色
  backColor: {
    type: String,
    default: 'rgb(250,252,254)'
  },
  // 提示文本
  text: {
    type: String,
    default: '搜索'
  }
});
  
const emit = defineEmits(['update:modelValue']);  
  
function updateValue(event) {  
  emit('update:modelValue', event.target.value);  
}  
// 处理按下回车键之后的事件
function handleEnter(event) {  
  // 这里可以添加处理回车键按下的逻辑，比如发送数据等  
  // console.log('Enter 键被按下，当前输入值为:', props.modelValue);  
  // 如果需要执行父组件的某个方法，可以通过 emit 触发一个自定义事件  
  emit('on-enter', props.modelValue);
}
let holderColor = ref(props.holderColor)
let fontColor = ref(props.fontColor)
let backColor = ref(props.backColor)
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
.iptBox{
    width: 40%;
    height: 50%;
    border: rgb(228,229,237) 1px solid;
    border-radius: 7px;
    background: rgb(250,252,254);
    display: flex;
    // justify-content: center;
    align-items: center;
    .ico{
        width: 10%;
        font-size: 10px;
        color: rgb(169,175,191);
        text-align: center;
    }
    input::placeholder{
        font-size: 8px;
        font-weight: bold;
        color: v-bind(holderColor);
    }
    .ipt{
        border: 0px;
        background: v-bind(backColor);
        outline: none;
        width: 80%;
        height: 80%;
        font-size: 8px;
        font-weight: bold;
        color: v-bind(fontColor);
    }
}
</style>