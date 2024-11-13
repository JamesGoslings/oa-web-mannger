<!-- 分配权限页面 -->
<template>
  <div class="assignAllSty">
    <div class="funTitle">{{ `正在为 “${role.roleName}” 分配权限` }}</div>
    <div class="funMode">
      <ActButton
        txt="退出"
        actColor="rgb(234,123,54)"
        backColor="rgb(252,245,237)"
        @click="goBackPage()"
      />
      <ActButton txt="保存并退出" @click="saveAndQuit()" />
      <el-tree
        ref="tree"
        :data="menuTreeList"
        node-key="id"
        show-checkbox
        default-expand-all
        :props="myProps"
        @check-change="getChooseMenusIdlist"
        :default-checked-keys="oldMenuIdList"
      />
    </div>
  </div>
</template>

<script setup>
import ActButton from "@/components/ActButton.vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm, useTips, useSimpleConfirm } from "@/utils/msgTip";
import {
  getMenuListByRoleId,
  getAllTreeMenus,
  getMenuIdListWithoutChilrenByRoleId,
  doAssignForRole,
} from "@/api/menu";

// 保存并退出
function saveAndQuit() {
  useSimpleConfirm(
    `你确定要保存对角色 “${role.value.roleName}” 的权限修改吗`
  ).then(async () => {
    let data = await doAssignForRole({
      roleId: role.value.id,
      menuIdList: chooseIdList.value,
    });
    useTips(`你成功对角色 “${role.value.roleName}” 进行了权限修改`, data);
    router.go(-1);
  });
}

const router = useRouter();
// 直接返回上一个路由
function goBackPage() {
  useSimpleConfirm("你确定要直接退出吗").then(() => {
    router.go(-1);
  });
}

// 存选中的id列表
let chooseIdList = ref([]);
// 配置树型复选框
let myProps = ref({ label: "name" });
// 通过监听选中与否来不断获取选中了的菜单
function getChooseMenusIdlist(data, checked, indeterminate) {
  const index = chooseIdList.value.indexOf(data.id);
  if (checked || indeterminate) {
    // 如果节点被选中且此前还没有添加，就添加到chooseIdList
    if (index < 0) {
      chooseIdList.value.push(data.id);
    }
  } else {
    // 如果节点被取消选中且已经存在于列表中，则从chooseIdList中移除
    if (index !== -1) {
      chooseIdList.value.splice(index, 1);
    }
  }
}

// 存原来的菜单id列表
let oldMenuIdList = ref([]);

// 拿到原本就有的菜单id列表(无子节点)

const getMenyIdListWithoutChilren = async () => {
  let { data } = await getMenuIdListWithoutChilrenByRoleId(role.value.id);
  console.log("============================>>>>>>>>");
  console.log(data);
  console.log("============================>>>>>>>>");
  // 将旧数据拿到默认选中里面
  oldMenuIdList.value = data;
};

// 获取到所有的树型菜单列表
const getTreeMenusList = async () => {
  let { data } = await getAllTreeMenus();
  menuTreeList.value = data;
  console.log(data);
};
// 存所有的menu
let menuTreeList = ref([]);
const route = useRoute();
// 存待操作的role
let role = ref({});
onMounted(() => {
  // 拿到对应角色的参数
  role.value.id = route.query.id;
  role.value.roleName = route.query.roleName;
  // 初始化菜单数据
  getTreeMenusList();
  // 拿原来的数据
  // getOldMenuList()

  getMenyIdListWithoutChilren();
});
</script>

<style lang="scss" scoped>
@import url("/src/assets/font-icon/iconfont.css");
@import "/src/styles/globalPage.scss";
@import "/src/styles/listSize.scss";
@import "/src/styles/commonStyles.scss";
.assignAllSty {
  margin-left: $left-distance;
  margin-top: $top-distance;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background: $page-back-color;
  padding: $page-padding;
  .funMode {
    background: #fff;
    width: 100%;
    padding: 3vh 2vw;
  }
}
</style>