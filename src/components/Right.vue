<!-- 右侧菜单栏 -->
<template>
    <div class="rightAll">
        <div class="line"></div>
        <div class="topMenuOne" v-for="(menu,index) in menus" :key="index">
            <span class="iconfont menuIco" v-html="menu.icon"></span>
            <span class="icoText">{{menu.name}}</span>
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
        margin-bottom: 2vh;
    }
    .topMenuOne{
        height: 5vh;
        color: rgb(136,136,136);
        display: flex;
        align-items: center;
        margin-bottom: 2vh;
        .menuIco{
            margin-left: 1vw;
            font-size: 15px;
        }
        .icoText{
            margin-left: 1vw;
            font-size: 9px;
            font-weight: bold;
        }
    }
}
</style>