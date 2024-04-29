<!-- 顶部菜单栏 -->
<template>
    <div class="topAll">
        <myInputBar></myInputBar>
        <span class="user">
            <img class="avatar" src="/src/assets/img/avatar.jpg"/>
            <span class="name">admin</span>
            <span class="open iconfont" style="-moz-transform: rotate(-90deg);-webkit-transform: rotate(-90deg);"
            v-if="!isChoose" @click="isChoose = !isChoose">&#xe656;</span>
            <span class="open iconfont" v-else @click="isChoose = !isChoose">&#xe656;</span>
        </span>
    </div>
    <UserUse v-if="isChoose"></UserUse>

</template>

<script setup>
import myInputBar from "./MyInputBar.vue"
import UserUse from "./UserUse.vue"

let isChoose = ref(false)
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';

.topAll{
    position: fixed;
	top: 0;
	right: 0;
	width: 80%;
    height: $top-distance;
    padding-left: 2%;
	overflow: hidden;
    background: #FFF;
    border-radius: 2px;
    box-shadow: 0px 0px 3px #928c8c64;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    user-select: none;
    .user{
        height: 100%;
        display: flex;
        align-items: center;
        .avatar{
            height: 60%;
            border-radius: 50%;
        }
        .name{
            padding: 0 1.8rem;
            font-size: 2vh;
            font-weight: bold;
            color: rgb(52,62,99);
        }
        .open{
            font-size: 1.5vh;
            margin-right: 0.6rem;
            color: rgb(161,169,198);
        }
    }
}
</style>