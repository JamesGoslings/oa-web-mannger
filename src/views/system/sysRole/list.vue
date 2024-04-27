<!-- 角色页面 -->
<template>
    <div class="roleSty">
        <div class="table">
            角色管理页面
            <button @click="goUser">去user页</button>
        </div>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

function goUser(){
    router.push('/system/sysUser')
}
</script>

<style lang="scss" scoped>
@import '/src/styles/globalPage.scss';
.roleSty{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    .table{
        margin: 2vh 0;
        width: 80%;
        background: #FFF;
        height: 100vh;
    }
}
</style>