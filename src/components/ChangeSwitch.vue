<!-- 用于切换的开关 -->
<template>
    <div class="switchAll">
        <span :class="{choiceOne: true,act: chooseType === 1}" @click="clickFun(1)">{{leftTxt}}</span>
        <span :class="{choiceOne: true,act: chooseType === 0}" @click="clickFun(0)">{{rightTxt}}</span>
    </div>
</template>

<script setup>


let props = defineProps({
    type: {
        type: Number,
        default(){
            return 0
        }
    },
    leftTxt: {
        type: String,
        default(){
            return '查看'
        }
    },
    rightTxt: {
        type: String,
        default(){
            return '新建'
        }
    },
    backColor: {
        type: String,
        default(){
            return 'rgb(244,249,255)'
        }
    },
    fontColor: {
        type: String,
        default(){
            return 'rgb(36,47,87)'
        }
    },
    actBackColor: {
        type: String,
        default(){
            return 'rgb(60,118,244)'
        }
    },
    actFontColor: {
        type: String,
        default(){
            return '#FFF'
        }
    },
    radius: {
        type: String,
        default(){
            return '150px'
        }
    },
    borderSize: {
        type: String,
        default(){
            return '1px'
        }
    }
})

let backColor = ref(props.backColor)
let fontColor = ref(props.fontColor)
let actFontColor = ref(props.actFontColor)
let actBackColor = ref(props.actBackColor)
let radius = ref(props.radius)
let borderSize = ref(props.borderSize)


// 使用 watch 监听 type 属性  
watch(() => props.type, (newVal) => {
    chooseType.value = newVal
})
// 判断当前的选择
let chooseType = ref(0)
function clickFun(type){
    chooseType.value = type
    sendValueToParent(type)
}

const emit = defineEmits(['value-sent'])
// 点击之后向父页面/组件传值
function sendValueToParent(type){
	emit('value-sent', type);
}
</script>

<style lang="scss" scoped>
@import '/src/styles/globalPage.scss';
@import '/src/styles/commonStyles.scss';
@import '/src/styles/listSize.scss';

// 242,235,252
.switchAll{
    width: 7vw;
    height: 3vh;
    // background: $main-back-color;
    background: v-bind(backColor);
    // border-radius: 150px;
    border-radius: v-bind(radius);
    display: flex;
    align-items: center;
    font-size: $common-font-size - 0.5;
    user-select: none;
    // color: $title-font-color;
    color: v-bind(fontColor);
    box-shadow: 0px 0px v-bind(borderSize) $box-shadow-color;
    .choiceOne{
        @include flex-box;
        width: 50%;
        height: 100%;
        // border-radius: 150px;
        border-radius: v-bind(radius);
    }
    .act{
        // background: $main-show-color;
        background: v-bind(actBackColor);
        // color: #FFF;
        color: v-bind(actFontColor);
    }
}
</style>