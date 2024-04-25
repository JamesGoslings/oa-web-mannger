<!-- 右侧菜单栏 -->
<template>
    <div class="rightAll">
        <div class="line"></div>
        <div v-for="(menu,index) in menus" :key="index">
            <div class="topMenuOne" @click="isChoose[index] = true" v-if="!isChoose[index]">
                <div class="msg">
                    <span class="iconfont menuIco" v-html="menu.icon"></span>
                    <span class="icoText">{{menu.name}}</span>
                </div>
                <span class="tip"></span>
            </div>
            <div class="topMenuOne" :style="{color: actStyle.fontColor,background: actStyle.backColor}"
             @click="isChoose[index] = false" v-else>
                <div class="msg">
                    <span class="iconfont menuIco" v-html="menu.icon"></span>
                    <span class="icoText">{{menu.name}}</span>
                </div>
                <span class="tip" :style="{background: actStyle.tipColor}"></span>
            </div>
         </div>
    </div>
</template>

<script setup>
// 接收顶级菜单
let menus = ref([
    {
        icon: '&#xe6fa;',
        name: '指示板'
    },
    {
        icon: '&#xe696;',
        name: '系统管理'
    },  
    {
        icon: '&#xe60c;',
        name: '审批管理'
    },  
    {
        icon: '&#xe646;',
        name: '审批设置'
    },  
    {
        icon: '&#xe604;',
        name: '考勤管理'
    }
])
// 判断是否选中
let isChoose = ref([false,false])
// 菜单被点击后的样式
const actStyle = ref({
    tipColor: 'rgb(60,118,244)',
    backColor: 'rgb(244,249,255)',
    fontColor: 'rgb(60,118,244)'
})

</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
.rightAll{
    position: fixed;
	top: 0;
	left: 0;
    width: 15%;
    height: 100%;
    z-index: 10;
    overflow: hidden;
    background: #FFF;
    border-radius: 2px;
    box-shadow: 0px 0px 3px #928c8c64;
    user-select: none;
    .line{
        width: 100%;
        height: 0.2vh;
        background: rgb(228,229,237);
        margin-top: 6.5vh;
    }
    .topMenuOne{
        width: 100%;
        height: 5vh;
        color: rgb(136,136,136);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1vh 0;
        // border: #000 1px solid;
        .msg{
            display: flex;
            align-items: center;
            .menuIco{
                margin-left: 1vw;
                font-size: 15px;
            }
            .icoText{
                margin-left: 1vw;
                font-size: 9px;
                // font-weight: bold;
            }
        }
        .tip{
            right: 0;
            width: 4px;
            height: 70%;
            border-radius: 2px;
            // background: rgb(60,118,244);
        }
    }
}
</style>