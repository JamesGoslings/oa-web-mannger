<!-- 显示用户登录登出的菜单的页面 -->
<template>
  <div class="userMenu">
    <div
      class="userMenuOne"
      v-for="(menu, i) in userMenus"
      :key="i"
      @click="useFun(i)"
    >
      <span class="line" v-if="i !== 0"></span>
      <span class="menuText">{{ menu }}</span>
    </div>
  </div>
</template>

<script setup>
import { removeToken } from "@/utils/auth";
import { useUserStore } from "@/store/userStore";
import { usePathStore } from "@/store/pathStore";
import { useRouter } from "vue-router";
import router from "@/routers/router";

let userMenus = ref(["个人信息", "退出登录", "设置"]);
function useFun(i) {
  if (i === 1) {
    // 退出登录，将token移除
    removeToken();
    // 将用户仓库和路径仓库的信息全部清除
    let user = useUserStore();
    let pathStore = usePathStore();
    for (var key in user) {
      user[key] = null;
    }
    for (var key in pathStore) {
      pathStore[key] = null;
    }
    router.push("/login");
  }
}
</script>

<style lang="scss" scoped>
@import "/src/styles/listSize.scss";
.userMenu {
  position: fixed;
  top: 8vh;
  right: 10px;
  width: 80px;
  background: #fff;
  box-shadow: 0px 0px 3px #928c8c64;
  z-index: 9;
  user-select: none;
  padding-bottom: 10px;
  .userMenuOne {
    width: 100%;
    height: 2vh;
    color: rgb(136, 136, 136);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 1vh 0;
    .menuText {
      font-size: $common-font-size;
      font-family: "幼圆";
    }
    .line {
      margin-bottom: 1vh;
      height: 0.01vh;
      width: 80%;
      background: rgb(225, 227, 225);
    }
  }
}
</style>