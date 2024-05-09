<!-- 用于切换的开关 -->
<template>
    <div class="switchAll">
        <span :class="{choiceOne: true,act: choose}" @click="clickFun(true,0)">查看</span>
        <span :class="{choiceOne: true,act: !choose}" @click="clickFun(false,1)">新建</span>
    </div>
</template>

<script setup>

let choose = ref(false)

function clickFun(flag,type){
    choose.value = flag
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
    background: $main-back-color;
    border-radius: 150px;
    display: flex;
    align-items: center;
    font-size: $common-font-size - 0.5;
    user-select: none;
    color: $title-font-color;
    box-shadow: $small-box-shadow;
    .choiceOne{
        @include flex-box;
        width: 50%;
        height: 100%;
        border-radius: 150px;
    }
    .act{
        background: $main-show-color;
        color: #FFF;
    }
}
</style>