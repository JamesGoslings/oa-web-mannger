<!-- 菜单树型列表的展示 -->
<template>
  <div class="allTreeList" v-for="(menu, i) in menuDataList" :key="i">
    <div class="listOneBar" :style="getBorder(menu.children == null)">
      <div class="msg" @click="checkDetailDialog(menu)">
        <span class="icoRound iconfont" v-html="menu.icon"></span>
        <span class="menuTxt">
          <span class="txtTitle">{{ menu.name }}</span>
          <span
            v-if="menu.children != null && menu.children.length != 0"
            class="txt"
            >{{ `${num[floor - 1]}级父菜单` }}</span
          >
          <span v-else class="txt">子菜单</span>
        </span>
      </div>
      <treeList
        v-if="menu.children != null && menu.children.length != 0"
        :parentName="getChildrenAllParentName(menu)"
        :menuDataList="menu.children"
        :floor="floor + 1"
      />
    </div>
  </div>
  <!-- <el-dialog v-model="openDialog" :title="detailTitle" width="500"
    draggable :close-on-click-modal="false">
    
        <el-form :model="form">
            <el-form-item label="菜单名称">
                <el-input v-model="checkedMenu.name" autocomplete="off" />
            </el-form-item>
            <el-form-item v-if="checkedMenu.parentName != null && checkedMenu.parentName != ''">
                <div></div>
            </el-form-item>
            <el-form-item label="菜单类型">
                <el-select
                v-model="checkedMenu.type"
                filterable
                placeholder="选择菜单类型"
                style="width: 240px"
                >
                    <el-option
                    v-for="(type,i) in typeList"
                    :key="i"
                    :label="type"
                    :value="i"
                    />
                </el-select>

            </el-form-item>
            <el-form-item label="菜单图标">
                <div class="iconfont ico" v-html="checkedMenu.icon"></div>
                <el-select
                v-model="checkedMenu.icon"
                filterable
                placeholder="选择图标"
                style="width: 240px"
                >
                    <el-option
                    v-for="(icon,i) in iconList"
                    :key="i"
                    :label="`${i} 号图标`"
                    :value="icon"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="上级菜单">
                <el-select
                v-model="checkedMenu.parentId"
                filterable
                placeholder="选择上一级菜单"
                style="width: 240px"
                >
                    <el-option
                    v-for="parentMenu in parentMenusMsg"
                    :key="parentMenu.id"
                    :label="parentMenu.totalName"
                    :value="parentMenu.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="菜单路径">
                <el-input v-model="checkedMenu.path" autocomplete="off" />
            </el-form-item>
            <el-form-item label="组件路径">
                <el-input v-model="checkedMenu.component" autocomplete="off" />
            </el-form-item>
            <el-form-item label="权限标识">
                <el-input v-model="checkedMenu.perms" autocomplete="off" />
            </el-form-item>
            <el-form-item label="创建时间">
                <div>{{checkedMenu.createTime}}</div>
            </el-form-item>
            <el-form-item label="修改时间">
                <div>{{checkedMenu.updateTime}}</div>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="openDialog = false">取消</el-button>
                <el-button type="danger" @click="removeOneMenu()">删除</el-button>
                <el-button type="primary" @click="updateChangeMenu()">保存</el-button>
            </div>
        </template>
    </el-dialog> -->
</template>

<script setup>
import treeList from "@/components/TreeMenuList.vue";
import { getCurrentInstance } from "vue";

let props = defineProps({
  menuDataList: {
    type: Array,
    default() {
      return [];
    },
  },
  floor: {
    type: Number,
    default() {
      return 1;
    },
  },
  parentName: {
    type: String,
    default() {
      return "";
    },
  },
});
let num = ref(["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]);

function getBorder(f) {
  return f
    ? {
        borderBottom: "rgb(209,213,219) 1px solid",
        marginLeft: props.floor + "vw",
      }
    : { marginLeft: props.floor + "vw" };
}

let checkedMenu = ref({});
function checkDetailDialog(menu) {
  checkedMenu.value = menu;
  let needMyName = props.floor === 1 ? `${menu.name}` : ` >> ${menu.name}`;
  checkedMenu.value.totalName = `${props.parentName}${needMyName}`;
  emitMitt(checkedMenu.value);
}

function getChildrenAllParentName(menu) {
  // 非顶级菜单的目录
  if (props.floor > 1) {
    return `${props.parentName} >> ${menu.name}`;
  }
  return menu.name + "";
}

// 通过全局事件传输当前要查看的menu
const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;
const emitMitt = function (menu = {}) {
  bus.emit("menuEvent", menu);
};
</script>

<style lang="scss" scoped>
@import url("/src/assets/font-icon/iconfont.css");
@import "/src/styles/commonStyles.scss";
@import "/src/styles/listSize.scss";

.allTreeList {
  width: 100%;
  // padding: 1vh 2vw;
  border-bottom: rgb(209, 213, 219) 1px solid;
  user-select: none;
  .listOneBar {
    padding: 3vh 0;
    margin: 1vh 0;
    // border-bottom: rgb(209,213,219) 1px solid;
    .msg {
      @include flex-box;
      justify-content: left;
      .icoRound {
        @include flex-box;
        width: 45px;
        height: 45px;
        background: rgb(209, 213, 219);
        border-radius: 50%;
        color: #fff;
        font-size: 20px;
      }
      .menuTxt {
        @include flex-box;
        margin-left: 1vw;
        justify-content: left;
        .txtTitle {
          font-weight: bold;
          width: 100%;
          margin-bottom: 1vh;
        }
        .txt {
          color: rgb(209, 213, 219);
          font-size: $common-font-size;
        }
      }
    }
    .msg:hover {
      color: $main-show-color;
      .icoRound {
        background: #fff;
        color: $main-show-color;
        border: $main-show-color 1px solid;
      }
      .txt {
        color: $main-show-color;
      }
    }
    .msg:active {
      color: $ipt-font-color;
      .icoRound {
        background: #fff;
        color: $ipt-font-color;
        border: $ipt-font-color 1px solid;
      }
      .txt {
        color: $ipt-font-color;
      }
    }
  }

  .ico {
    font-size: 30px;
    color: $ipt-font-color;
  }
}
</style>