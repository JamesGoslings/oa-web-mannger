<template>
  <Header></Header>
  <Left></Left>
  <div class="homeSty">
    <router-view></router-view>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Left from "@/components/Left.vue";
import router from "@/routers/router";
import { useUserStore } from "@/store/userStore";

// router.push('/sysUser')
// console.log('==========Msg============')
// console.log(useUserStore().buttons)
// console.log('==========Msg============')
</script>

<style lang="scss" scoped>
.homeSty {
  position: fixed;
  top: 0;
  left: 0;
  // padding-left: 15vw;
  // padding-top: 8vh;
  width: 100%;
  height: 100%;
  background: rgb(244, 247, 252);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>