<template>
  <div class="globalSty">
    <div class="bigCard">
      <div class="imgBox">
        <img class="img" src="/src/assets/oa-img.png" />
      </div>
      <div class="msgCardBox">
        <div class="msgCard">
          <div class="title">登录账号</div>
          <span class="iptBox">
            <div class="ico iconfont">&#xea92;</div>
            <input
              class="ipt"
              placeholder="用户名"
              v-model="userMsg.username"
            />
          </span>
          <span class="iptBox">
            <div class="ico iconfont">&#xe64c;</div>
            <input
              class="ipt"
              placeholder="密码"
              type="password"
              v-model="userMsg.password"
            />
          </span>
          <span class="errorText">{{ errorMsg }}</span>
          <button class="btn" @click="useLogin()">立即登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { login } from "@/api/login.js";
import { useRouter } from "vue-router";
import { setToken } from "@/utils/auth";

const router = useRouter();
let userMsg = ref({ username: "", password: "" });
let errorMsg = ref("");
// 发起登录请求拿到token并放入cookie
const useLogin = async () => {
  console.log(userMsg.value);
  let username = userMsg.value.username;
  let pwd = userMsg.value.password;
  if (username === "" || username === null) {
    errorMsg.value = "*" + "用户名不能为空";
    return;
  }
  if (pwd === "" || pwd === null) {
    errorMsg.value = "*" + "密码不能为空";
    return;
  }
  await login(userMsg.value)
    .catch((res) => {
      // 登录出错回显错误信息
      errorMsg.value = "*" + res.message;
    })
    .then((res) => {
      // 成功就存token
      setToken(res.data.token);
      // 跳转路由
      router.push("/home");
    });
};
</script>

<style lang="scss" scoped>
@import url("/src/assets/font-icon/iconfont.css");
@import "/src/styles/listSize.scss";
.globalSty {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("/src/assets/back.png");
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  .bigCard {
    width: 60%;
    height: 60%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px #928c8c64;
    display: flex;
    .imgBox {
      width: 60%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        width: 90%;
      }
    }
    .msgCardBox {
      width: 40%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .msgCard {
        padding: 20px 10px;
        height: 70%;
        width: 70%;
        box-shadow: 0px 0px 8px #928c8c64;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .title {
          width: 100%;
          height: 20%;
          text-align: center;
          font-size: 30px;
          color: rgb(235, 229, 225);
        }
        .errorText {
          font-size: $common-font-size;
          color: rgb(249, 190, 23);
        }
        .iptBox {
          width: 80%;
          height: 15%;
          background: rgb(253, 253, 254);
          box-shadow: 0px 0px 2px #928c8c64;
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          .ico {
            width: 10%;
            font-size: $common-font-size;
            color: rgb(235, 229, 225);
            text-align: center;
          }
          input::placeholder {
            font-size: $common-font-size;
            color: rgb(235, 229, 225);
          }
          .ipt {
            border: 0px;
            background: rgb(253, 253, 254);
            outline: none;
            width: 80%;
            height: 90%;
            font-size: $common-font-size;
            color: rgb(199, 192, 188);
          }
        }
        .btn {
          outline: none;
          border-radius: 5px;
          border: 0px;
          background: rgb(246, 98, 86);
          width: 80%;
          height: 12%;
          font-size: $common-font-size;
          color: #fff;
          transition: border-radius 2s;
          -webkit-transition: border-radius 1s;
          &:hover {
            background: rgb(202, 131, 125);
            border-bottom-right-radius: 50px;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 10px;
            border-top-right-radius: 10px;
          }
        }
      }
    }
  }
}
</style>