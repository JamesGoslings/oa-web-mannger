<!-- 左侧菜单栏 -->
<template>
  <div class="rightAll" @path-sent="receivePath">
    <div class="line"></div>
    <div v-for="(menu, index) in menus" :key="index">
      <div
        :style="{ background: backColors[index] }"
        @mouseenter="backColors[index] = actStyle.backColor"
        @mouseleave="backColors[index] = '#FFF'"
      >
        <div
          class="topMenuOne"
          @click="isChoose[index] = true"
          v-if="!isChoose[index]"
        >
          <div class="msg">
            <span class="iconfont menuIco" v-html="menu.meta.icon"></span>
            <span class="icoText">{{ menu.meta.title }}</span>
          </div>
          <span class="tip"></span>
        </div>
        <div
          class="topMenuOne"
          :style="{ color: actStyle.fontColor, background: actStyle.backColor }"
          @click="isChoose[index] = false"
          v-else
        >
          <div class="msg">
            <span class="iconfont menuIco" v-html="menu.meta.icon"></span>
            <span class="icoText">{{ menu.meta.title }}</span>
          </div>
          <span class="tip" :style="{ background: actStyle.tipColor }"></span>
        </div>
      </div>
      <div v-show="isChoose[index]">
        <Tree
          v-if="menu.alwaysShow"
          :menuList="menu.children"
          :floor="1"
        ></Tree>
      </div>
    </div>
  </div>
</template>

<script setup>
import Tree from "@/components/TreeMenu.vue";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";

// 确定每个菜单栏被鼠标经过时的背景颜色
let backColors = ref([""]);
// 接收顶级菜单(深拷贝)
let menus = ref(useUserStore().menus);
// console.log('============MENUS===============')
// console.log(useRouter().getRoutes())
// console.log(menus.value[0].meta)
// console.log('============MENUS===============')
// let menus = ref([
//     {
//         icon: '&#xe6fa;',
//         name: '指示板'
//     },
//     {
//         icon: '&#xe696;',
//         name: '系统管理',
//         children:[
//             {
//                 icon: '&#xe6aa;',
//                 name:'日志管理',
//                 children: [
//                     {
//                         icon: '&#xe999;',
//                         name: '信息日志'
//                     },
//                     {
//                         icon: '&#xe63e;',
//                         name: '登录日志'
//                     }
//                 ]
//             },
//             {
//                 icon: '&#xe999;',
//                 name: '测试管理'
//             }
//         ]
//     },
//     {
//         icon: '&#xe60c;',
//         name: '审批管理'
//     },
//     {
//         icon: '&#xe646;',
//         name: '审批设置'
//     },
//     {
//         icon: '&#xe604;',
//         name: '考勤管理'
//     }
// ])
// 判断是否选中
let isChoose = ref([false, false]);
// 菜单被点击后的样式
const actStyle = ref({
  tipColor: "rgb(60,118,244)",
  backColor: "rgb(244,249,255)",
  fontColor: "rgb(60,118,244)",
});

function receivePath(path) {
  console.log("path===========>" + path);
}
</script>

<style lang="scss" scoped>
@import url("/src/assets/font-icon/iconfont.css");
@import "/src/styles/globalPage.scss";
@import "/src/styles/listSize.scss";

.rightAll {
  position: fixed;
  top: 0;
  left: 0;
  width: $left-distance;
  height: 100%;
  z-index: 10;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 3px #928c8c64;
  user-select: none;
  overflow-y: auto;
  overflow-x: hidden;
  .line {
    width: 100%;
    height: 0.2vh;
    background: rgb(228, 229, 237);
    margin-top: 6.5vh;
  }
  .topMenuOne {
    width: 100%;
    height: 5vh;
    color: rgb(136, 136, 136);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1vh 0;
    // border: #000 1px solid;
    .msg {
      display: flex;
      align-items: center;
      .menuIco {
        margin-left: 1vw;
        font-size: $title-font-size;
      }
      .icoText {
        margin-left: 1vw;
        font-size: $common-font-size;
        // font-weight: bold;
      }
    }
    .tip {
      right: 0;
      width: 4px;
      height: 70%;
      border-radius: 2px;
      // background: rgb(60,118,244);
    }
  }
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 0px; /* 滚动条宽度 */
}
</style>