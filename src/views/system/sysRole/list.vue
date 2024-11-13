<!-- 角色页面 -->
<template>
  <div class="roleSty">
    <div class="funTitle allTitle">角色列表</div>
    <div class="tableBox baseCard">
      <div class="iptBar">
        <myInputBar
          v-model="iptObj.keyword"
          class="ipt"
          font-color="rgb(9,82,200)"
          holder-color="rgb(211,227,253)"
          text="搜索角色，请输入角色名称或编码"
        />
        <el-button type="primary" plain @click="getPageData()">搜索</el-button>
      </div>
      <el-table
        class="tab"
        :data="pageRoles"
        style="width: 90%"
        stripe
        :border="true"
      >
        <el-table-column fixed prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column fixed="right" label="操作" width="250">
          <template v-slot="scope">
            <div class="tabFooter">
              <el-button
                type="success"
                size="small"
                plain
                @click="removeOne(scope.row)"
                >删除</el-button
              >
              <el-button
                type="info"
                size="small"
                plain
                @click="goToAssignAuth(scope.row)"
                >分配权限</el-button
              >
              <el-button
                type="primary"
                size="small"
                plain
                @click="editDialogInit(scope.row)"
                >编辑</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 显示可 编辑/删除 角色的对话框 -->
      <el-dialog
        v-model="openChoiseDialog"
        :title="editOrSaveDialogTitle"
        width="400"
        draggable
        :close-on-click-modal="false"
        append-to-body
      >
        <!-- 处理编辑选项的单选框列表 -->
        <el-radio-group v-model="chooseRoleIndex" v-if="funType === 2">
          <div
            v-for="(role, i) in allRoles"
            :key="role.id"
            class="choiceRow"
            :title="getRoleMsgStr(role)"
          >
            <el-radio :value="i">{{ role.roleName }}</el-radio>
          </div>
        </el-radio-group>
        <el-checkbox-group v-model="chooseRoles" v-else>
          <div
            class="choiceRow"
            v-for="role in allRoles"
            :key="role.id"
            :title="getRoleMsgStr(role)"
          >
            <el-checkbox :value="role.id">
              {{ role.roleName }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <!-- 处理删除选项的复选框列表 -->
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="openChoiseDialog = false">取消</el-button>
            <el-button
              type="primary"
              @click="goToEditInitOrRemoveChooseRole()"
              :disabled="chooseRoleIndex < 0 && funType === 2"
              >确定</el-button
            >
          </div>
        </template>
      </el-dialog>

      <!-- 编辑角色的对话框 -->

      <el-dialog
        v-model="openDialog"
        :title="editOrSaveDialogTitle"
        width="400"
        draggable
        :close-on-click-modal="false"
        append-to-body
      >
        <el-form :model="form">
          <el-form-item label="角色名称">
            <el-input v-model="changedRole.roleName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="changedRole.description" autocomplete="off" />
          </el-form-item>
          <el-form-item label="角色编码">
            <el-input v-model="changedRole.roleCode" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="openDialog = false">取消</el-button>
            <el-button type="primary" @click="editOrSaveRole()">保存</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="page"
        :total="total"
        :page-size="limit"
        style="padding: 30px 0; text-align: center"
        layout="total, prev, pager, next, jumper"
        @current-change="getPageData"
      />
    </div>
    <div class="footer baseCard">
      <div class="mode">
        <div class="funTitle myTitle">角色操作模块</div>
        <div class="funCards">
          <span
            class="funCard"
            v-for="(card, i) in cards"
            :key="i"
            @click="runFunMode(i)"
          >
            <div class="funIco iconfont" v-html="card.icon"></div>
            <div class="funText">
              <div class="funTitle aFunTitle">{{ card.text }}</div>
              <div class="description">{{ card.description }}</div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import myInputBar from "@/components/MyInputBar.vue";
import {
  getAllRoles,
  getRolePage,
  removeOneRoleById,
  updateRole,
  saveRole,
  removeMoreOneRoleByIdList,
} from "@/api/role";
import { onMounted } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import { useConfirm, useTips } from "@/utils/msgTip";
import { useRouter } from "vue-router";

const router = useRouter();
// 跳转权限分配路由
function goToAssignAuth(role) {
  router.push(`/system/assignAuth?id=${role.id}&roleName=${role.roleName}`);
}
// 获取角色信息字符串
function getRoleMsgStr(role) {
  let description =
    role.description == null || role.description === ""
      ? "（没写描述）"
      : role.description;
  let roleCode =
    role.roleCode == null || role.roleCode === ""
      ? "（没写编码）"
      : role.roleCode;
  return `描述: “${description}”，编码: “${roleCode}”`;
}
// 用于显示操作功能卡片
let cards = ref([
  {
    icon: "&#xe619;",
    text: "添加角色",
    description: "点击此处添加新的角色",
  },
  {
    icon: "&#xe603;",
    text: "编辑角色",
    description: "点击此处编辑已有的角色",
  },
  {
    icon: "&#xe64d;",
    text: "删除角色",
    description: "点击此处删除已有的角色",
  },
]);
// 点击功能模块触发的方法
function runFunMode(i) {
  // 新建角色
  if (i === 0) {
    saveDialogInit();
  } else if (i === 1) {
    editOrSaveDialogTitle.value = "请选择要编辑的角色";
    funType.value = 2;
    openChoiseDialog.value = true;
  } else {
    editOrSaveDialogTitle.value = "请选择要删除的角色（可多选）";
    funType.value = 3;
    openChoiseDialog.value = true;
  }
}
let chooseRoleIndex = ref(-1);
// 用于控制选项对话框的开关
let openChoiseDialog = ref(false);
// 用于存选中的多个role
let chooseRoles = ref([]);
function goToEditInitOrRemoveChooseRole() {
  // 编辑框的逻辑
  if (funType.value === 2) {
    // TODO 关闭选项弹窗后转到具体修改的对话框
    openChoiseDialog.value = false;
    editDialogInit(allRoles.value[chooseRoleIndex.value]);
    chooseRoleIndex.value = -1;
  } else if (funType.value === 3) {
    removeChooseRoles(chooseRoles.value);
  }
}
// 批量删除具体逻辑
const removeChooseRoles = async (idList) => {
  useConfirm(`你确定要删除以上勾选的角色吗？`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // console.log(idList)
      let data = await removeMoreOneRoleByIdList(idList);
      // console.log('=======resData==========>>>>')
      // console.log(data)
      // console.log('=======resData==========>>>>')
      // 清空选中的role
      chooseRoles.value = [];
      // 关闭 选项的对话框
      openChoiseDialog.value = false;
      // 给出提示
      useTips("成功删除选中的角色~", data);
      // 刷新页面以及总角色记录
      getAllRoleList();
      getPageData();
    })
    .catch(() => {
      console.log("点击了取消");
    });
};
// 新建角色的初始化工作
function saveDialogInit() {
  editOrSaveDialogTitle.value = "添加角色";
  funType.value = 1;
  // 清空changedRole的数据
  changedRole.value = {};
  openDialog.value = true;
}
// 用于显示弹框的title
let editOrSaveDialogTitle = ref("");
// 判断具体是哪个功能 0: 编辑 1: 新建 2: 编辑选项框 3: 删除选项框
let funType = ref(0);
// 用于控制弹框的开关
let openDialog = ref(false);
// 用于存新建/修改过的role对象
let changedRole = ref({});
// 修改角色的初始化工作
function editDialogInit(oldRole) {
  // TODO 将旧值同步到changedRole中作为初始值
  changedRole.value = oldRole;
  editOrSaveDialogTitle.value = `编辑角色 “${oldRole.roleName}” 中~`;
  funType.value = 0;
  // 开启弹框
  openDialog.value = true;
}
// 修改或新建角色的请求
const editOrSaveRole = async () => {
  console.log("========待处理的role=====>>>>");
  console.log(changedRole.value);
  console.log("=============>>>>");
  let tipMsg = "";
  let data = {};
  if (funType.value === 0) {
    // 保证更新修改日期
    changedRole.value.updateTime = null;
    data = await updateRole(changedRole.value);
    tipMsg = `成功修改角色 “${changedRole.value.roleName}”`;
  } else if (funType.value === 1) {
    data = await saveRole(changedRole.value);
    tipMsg = "添加角色成功!";
  }
  // 关闭弹窗
  openDialog.value = false;
  // 给提示
  useTips(tipMsg, data);
  // 刷新页面
  getPageData();
};

// 分页数据
let page = ref(1);
let total = ref(10);
let limit = ref(3);
let iptObj = ref({ keyword: "" });
// 存当前页面拿到的roles
let pageRoles = ref([]);
const getPageData = async () => {
  let { data } = await getRolePage(page.value, limit.value, iptObj.value);
  pageRoles.value = data.records;
  total.value = data.total;
};
// 接收全部的角色
let allRoles = ref([]);
const getAllRoleList = async () => {
  let { data } = await getAllRoles();
  allRoles.value = data;
};
// 删除角色
const removeOne = async (role) => {
  useConfirm(`你确定要删除角色 “${role.roleName}” 吗？`, "友情提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      removeOneRoleById(role.id).then((res) => {
        // 删除完成刷新页面以及更新总角色数据并给出提示
        getAllRoleList();
        getPageData();
        useTips(`你已成功删除角色 “${role.roleName}”`, res);
      });
    })
    .catch(() => {
      console.log("点击了取消");
    });
};
onMounted(() => {
  getAllRoleList();
  getPageData();
});
</script>

<style lang="scss" scoped>
@import url("/src/assets/font-icon/iconfont.css");
@import "/src/styles/globalPage.scss";
@import "/src/styles/listSize.scss";
@import "/src/styles/commonStyles.scss";
.roleSty {
  margin-left: $left-distance;
  margin-top: $top-distance;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background: rgb(244, 247, 252);
  .allTitle {
    padding: $page-padding;
  }
  .tableBox {
    margin: $page-padding;
    margin-bottom: 5vh;
    width: 100%;
    background: #fff;
    @include flex-box;
    .iptBar {
      width: 90%;
      @include flex-box;
      justify-content: space-between;
      margin: 2vh 0;
      .ipt {
        width: 90%;
        height: 4vh;
      }
    }
    .tab {
      margin-bottom: 2vh;
      :deep() {
        .is-leaf {
          background-color: rgb(229, 231, 235);
        }
        .el-table__cell {
          color: $title-font-color;
          text-align: center;
          font-size: $common-font-size;
        }
      }
      .tabFooter {
        @include flex-box;
      }
    }
    :deep() {
      .el-dialog__header {
        text-align: center;
        margin-left: 48px;
        color: $title-font-color;
      }
      .el-form {
        @include flex-box;
        .el-form-item {
          width: auto;
          min-width: 0;
          @include flex-box;
        }
      }
      .dialog-footer {
        @include flex-box;
      }
    }
  }
  .choiceRow {
    width: 100%;
    @include flex-box;
  }
  .footer {
    // margin-top: 50vh;
    padding-left: $left-distance;
    width: 100%;
    height: 30vh;
    background: #fff;
    position: absolute;
    bottom: 0;
    user-select: none;
    .mode {
      width: 79%;
      background: #fff;
      padding: $page-padding;
      // .myTitle{
      // }
      .funCards {
        width: 100%;
        @include flex-box;
        justify-content: space-between;
        .funCard {
          padding: 15px;
          padding-left: 10px;
          padding-right: 10px;
          width: 25%;
          background: rgb(243, 244, 246);
          box-shadow: 0px 0px 4px $box-shadow-color;
          .funIco {
            color: $main-show-color;
            font-size: $title-font-size;
          }
          .funText {
            .description {
              color: $third-show-color;
            }
          }
        }
        .funCard:active {
          background: #fefcfc;
          .funIco,
          .aFunTitle,
          .description {
            color: $holder-font-color;
          }
        }
      }
    }
  }
}
</style>