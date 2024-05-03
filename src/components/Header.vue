<!-- 顶部菜单栏 -->
<template>
    <div class="topAll">
        <myInputBar v-model="iptValue" @on-enter="handleEnter"></myInputBar>
        <span class="user">
            <img class="avatar" :src="avatarPath"/>
            <span class="name">{{userMsg.name}}</span>
            <span class="open iconfont" style="-moz-transform: rotate(-90deg);-webkit-transform: rotate(-90deg);"
            v-if="!isChoose" @click="isChoose = !isChoose">&#xe656;</span>
            <span class="open iconfont" v-else @click="isChoose = !isChoose">&#xe656;</span>
        </span>
    </div>
    <UserUse v-if="isChoose"></UserUse>

</template>

<script setup>
import { onMounted } from "vue"
import myInputBar from "./MyInputBar.vue"
import UserUse from "./UserUse.vue"
import {useUserStore} from '@/store/userStore'
import {getOneUser} from '@/api/user'

let isChoose = ref(false)
let iptValue = ref('')
function handleEnter() {  
  // 按下回车键时执行的逻辑
  console.log('===============================================')
  console.log('你按下了回车键，输入的值是:', iptValue.value);
  console.log('===============================================')
  // 逻辑完成清除输入值
  iptValue.value = ''
}
// 头像地址
let avatarPath = ref('/src/assets/img/default_avatar.png')
let userMsg = ref({userId: 0})
const initMsg = async()=>{
    let {data} = await getOneUser(userMsg.value.userId)
    userMsg.value = data
    if(data.avatarUrl !== null && data.avatarUrl != ''){
        avatarPath.value = data.avatarUrl
    }
}
onMounted(()=>{
    userMsg.value.userId = useUserStore().id
    initMsg()
})
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