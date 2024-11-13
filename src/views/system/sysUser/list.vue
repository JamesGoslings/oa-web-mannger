<!-- 用户管理页面 -->
<template>
  <div class="userManngerAll">
    <div class="funTitle">用户表</div>
    <div class="baseCard tableBox">
      <div class="tableFuns">
        <actButton
          class="actBtn"
          txt="+添加"
          actColor="rgb(60,118,244)"
          @click="saveOrUpdateDialogInit(0)"
        ></actButton>
        <actButton
          class="actBtn"
          txt="&#xe614; 重置"
          actColor="rgb(234,123,54)"
          backColor="rgb(252,245,237)"
          @click="resetPage()"
        />
        <myInputBar
          class="myIpt"
          text="搜索用户，请输入用户名或姓名或电话号码"
          fontColor="rgb(9,82,200)"
          holderColor="rgb(211,227,253)"
          v-model="iptValue"
          @on-enter="handleEnter"
        />
        <!-- 添加/修改用户的弹窗 -->

        <el-dialog
          v-model="dialogFormVisible"
          :title="saveOrUpdateDialogTitle"
          width="500"
          class="dialog"
          draggable
          :close-on-click-modal="false"
          v-if="dialogFormVisible"
          append-to-body
        >
          <el-form :model="form">
            <el-form-item label="姓名" label-width="140px">
              <el-input v-model="changedUser.name" autocomplete="off" />
            </el-form-item>

            <el-form-item label="电话号码" label-width="140px">
              <el-input v-model="changedUser.phone" autocomplete="off" />
            </el-form-item>

            <el-form-item label="用户名" label-width="140px">
              <el-input
                v-model="changedUser.username"
                autocomplete="off"
                @input="checkUsername(0)"
                @load="checkUsername(0)"
                v-if="funType === 0"
              />
              <el-input
                v-model="changedUser.username"
                autocomplete="off"
                @input="checkUsername(1)"
                @load="checkUsername(1)"
                v-else
              />
            </el-form-item>
            <p class="errMsg">{{ iptMsg.usernameErrorMsg }}</p>

            <el-form-item v-if="funType === 0 || tempFlag">
              <el-form-item label="密码" label-width="140px">
                <el-input
                  v-model="changedUser.password"
                  autocomplete="off"
                  @input="checkPwd(0)"
                  type="password"
                />
              </el-form-item>
              <p class="errMsg">{{ iptMsg.errorMsg }}</p>

              <el-form-item label="再次输入密码" label-width="140px">
                <el-input
                  v-model="iptMsg.rePassword"
                  autocomplete="off"
                  @input="checkPwd(1)"
                  type="password"
                />
              </el-form-item>
              <p class="errMsg">{{ iptMsg.reErrorMsg }}</p>
            </el-form-item>
            <el-form-item v-else>
              <el-form-item label="密码" label-width="140px">
                <el-input autocomplete="off" type="password" disabled />
              </el-form-item>
              <p
                class="errMsg"
                style="color: rgb(7, 8, 252)"
                @click="tempFlag = true"
              >
                修改密码
              </p>
            </el-form-item>

            <!-- 岗位和部门改选项式填写 -->
            <el-form-item label="部门" label-width="140px">
              <el-select
                v-model="chooseDept"
                filterable
                placeholder="选择部门"
                style="width: 240px"
              >
                <el-option
                  v-for="dept in totalDept"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
            <!-- 保证只显示所选部门及其子部门的岗位 -->

            <el-form-item label="岗位" label-width="140px">
              <el-select
                v-model="choosePost"
                filterable
                placeholder="选择岗位"
                style="width: 240px"
              >
                <el-option
                  v-for="post in needPosts"
                  :key="post.id"
                  :label="post.name"
                  :value="post.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button
                type="primary"
                @click="saveUser()"
                :disabled="checkAll()"
                v-if="funType === 0"
              >
                确定
              </el-button>
              <el-button
                type="primary"
                @click="updateThisUser()"
                :disabled="checkAll()"
                v-else
              >
                确定
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <table class="table" cellspacing="0px">
        <tr class="ltr">
          <th class="td2">-</th>
          <th v-for="(tabHead, i) in tabHeads" :key="i">{{ tabHead }}</th>
        </tr>
        <tbody v-for="(user, i) in users" :key="i">
          <tr
            :class="{ ltr: true, ltrBackColor: i % 2 === 0 }"
            @load="trStyleChoose(i)"
          >
            <td class="td2">
              <el-checkbox v-model="choices[user.userId]" />
            </td>
            <td v-for="(field, j) in fields" :key="j">
              <span v-if="field !== 'state' && field !== 'roleList'">{{
                user[field]
              }}</span>
              <span
                v-else-if="field === 'roleList'"
                v-text="getMyRoleListNames(user.roleList)"
              ></span>
              <span v-else>
                <el-switch
                  class="mt-2"
                  v-model="statusValue[user.userId]"
                  inline-prompt
                  :active-icon="Check"
                  :inactive-icon="Close"
                  @click="
                    updateStatus(
                      statusValue[user.userId],
                      user.status,
                      user.userId
                    )
                  "
                />
              </span>
            </td>
            <td style="min-width: 8vw">
              <!-- 修改按钮 -->
              <baseButton
                content="&#xe71a;"
                mainBackColor="rgb(244,249,255)"
                fontColor="rgb(60,118,244)"
                @click="saveOrUpdateDialogInit(1, user)"
                style="margin-right: 1vw"
                title="修改"
              />
              <baseButton
                content="&#xe60d;"
                mainBackColor="rgb(250,252,254)"
                fontColor="rgb(143, 150, 172)"
                style="margin-right: 1vw"
                title="分配角色"
                @click="initRoleDialog(user)"
              />
              <baseButton
                mainBackColor="rgb(252,245,237)"
                fontColor="rgb(234,123,54)"
                @click="openRemoveDialog(user)"
                title="删除"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 分配角色的提示框 -->
      <el-dialog
        v-model="assignDialogOpen"
        :title="assignTitle"
        width="500"
        class="dialog"
        draggable
        :close-on-click-modal="false"
        append-to-body
      >
        <div class="checkBoxes">
          <span v-for="(role, i) in allRoles" :key="i" style="margin: 0 5px">
            <span>
              <el-checkbox v-model="role.isChoose" />
              {{ role.roleName }}
            </span>
          </span>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="assignDialogOpen = false">取消</el-button>
            <el-button type="primary" @click="doThisAssign()"> 确定 </el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 删除单用户的提示框  -->
      <el-dialog
        v-model="removeDialogOpen"
        :title="removeDialogTitle"
        width="400"
        class="dialog"
        draggable
        :close-on-click-modal="false"
        append-to-body
      >
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="removeDialogOpen = false">取消</el-button>
            <el-button type="primary" @click="removeThisUser(tempUser)">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
      <div class="usePage" id="myPage">
        <el-pagination
          class="page"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[2, 5, 10, 15]"
          :small="small"
          :disabled="disabled"
          layout="sizes, prev, pager, next, jumper"
          :total="pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div class="chooseUsers">
      <div class="baseCard boxTitle">已选中用户</div>
      <div class="baseCard userCard" v-for="(user, i) in choseUsers" :key="i">
        <img class="avatar" :src="user.avatarUrl" />
        <div class="msg">
          <div class="name">{{ user.name }}</div>
          <div>{{ `部门：${user.dept}` }}</div>
          <div>{{ `岗位：${user.post}` }}</div>
          <div>{{ `电话号码；${user.phone}` }}</div>
          <div>
            <baseButton
              style="margin: 5px 5px"
              content="&#xe71a;"
              mainBackColor="rgb(244,249,255)"
              fontColor="rgb(60,118,244)"
              @click="saveOrUpdateDialogInit(1, user)"
              title="修改"
            />
            <baseButton
              content="&#xe60d;"
              mainBackColor="rgb(250,252,254)"
              fontColor="rgb(143, 150, 172)"
              style="margin: 5px 5px"
              title="分配角色"
              @click="initRoleDialog(user)"
            />
            <baseButton
              style="margin: 5px 5px"
              mainBackColor="rgb(252,245,237)"
              fontColor="rgb(234,123,54)"
              @click="openRemoveDialog(user)"
              title="删除"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import actButton from "@/components/ActButton.vue";
import myInputBar from "@/components/MyInputBar.vue";
import baseButton from "@/components/BaseIconButton.vue";
import MySwitch from "@/components/MySwitch.vue";
import { useRouter } from "vue-router";
import {
  getPageUsers,
  getAllUserMsg,
  updateUserStatus,
  checkUsernameIsExist,
  save,
  removeOne,
  update,
} from "@/api/user";
import { getAllRoles, getAssignByUserId, doAssign } from "@/api/role";
import { getAllDept } from "@/api/dept";
import { getAllPostByDeptId } from "@/api/post";
import { useTips } from "@/utils/msgTip";
import { onMounted, watch } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 用于显示分配角色的弹窗的title
let assignTitle = ref("");
// 存所有角色
let allRoles = ref([]);
let assignUser = ref({});
function initRoleDialog(user) {
  getAllRoleList().then(() => {
    getAssign(user.userId).then(() => {
      assignUser.value = user;
      assignTitle.value = `为 "${user.name}" 分配角色`;
      assignDialogOpen.value = true;
    });
  });
}
// 拿到对应用户拥有的角色
const getAssign = async (userId) => {
  let { data } = await getAssignByUserId(userId);
  let myRoles = data.assginRoleList;
  // TODO 通过set去重来进行拥有的角色的列表和总列表的比对，让id一样的isChoose为true
  // 使用Set来存储拥有角色列表中所有role的id
  let idsInMyRoles = new Set(myRoles.map((item) => item.id));
  // 遍历数组allRoles，如果元素的id在Set中，则设置isChoose为true
  allRoles.value.forEach((itemA) => {
    if (idsInMyRoles.has(itemA.id)) {
      itemA.isChoose = true;
    } else {
      itemA.isChoose = false;
    }
  });
};
// 拿到全部的角色
const getAllRoleList = async () => {
  let { data } = await getAllRoles();
  allRoles.value = data;
};
// 分配角色
const doThisAssign = async () => {
  let assignMsg = { roleIdList: [], userId: 0 };
  let i = 0;
  //TODO 遍历allRoles，将被选中的role都装到assignMsg.roleList中
  allRoles.value.forEach((role) => {
    if (role.isChoose) {
      assignMsg.roleIdList[i++] = role.id;
    }
  });
  assignMsg.userId = assignUser.value.userId;
  let data = await doAssign(assignMsg);
  console.log(data);
  assignDialogOpen.value = false;
  useTips(`为 "${assignUser.value.name}" 分配角色成功`, data);
  getPages({ keyword: "" });
};
// 用于确定是否打开分配角色的对话框
let assignDialogOpen = ref(false);
// 用于显示表单弹窗的title
let saveOrUpdateDialogTitle = ref("");
// 用于确定是否要修改密码
let tempFlag = ref(false);
// 判断是否打开表单弹窗
let dialogFormVisible = ref(false);
function saveOrUpdateDialogInit(type, oldUser = {}) {
  funType.value = type;
  aOldUser.value = oldUser;
  tempFlag.value = false;
  if (type === 0) {
    saveOrUpdateDialogTitle.value = "添加新用户";
    changedUser.value = { username: "", password: "" };
    chooseDept.value = null;
    choosePost.value = null;
    iptMsg.value.rePassword = "";
  } else {
    saveOrUpdateDialogTitle.value = `修改用户 “${oldUser.name}” `;
    // 初始化原有信息
    console.log(oldUser);
    changedUser.value = {
      username: oldUser.username,
      password: "",
      name: oldUser.name,
      phone: oldUser.phone,
    };
    chooseDept.value = oldUser.deptId;
    choosePost.value = oldUser.postId;
    console.log(changedUser.value);
  }
  checkUsername(type);
  // 初始化完毕，最终打开弹窗
  dialogFormVisible.value = true;
}
// 用于让其他方法知道当前是修改还是新建
let funType = ref(0);
// 存修改前的用户信息
let aOldUser = ref({});
// 存再次输入的密码以及错误信息
let iptMsg = ref({
  rePassword: "",
  reErrorMsg: "",
  errorMsg: "",
  usernameErrorMsg: "",
});
// 存储添加/修改后的用户的值
let changedUser = ref({ username: "", password: "" });
// 输入密码或再次密码时触发的校对方法(type为0则是pwd，为1则是rePwd)
function checkPwd(type) {
  let pwd = changedUser.value.password;
  let rePwd = iptMsg.value.rePassword;
  if (type === 0) {
    console.log("输入密码");
    if (pwd === undefined || pwd.length < 4) {
      iptMsg.value.errorMsg = "* 密码不能少于4字符";
      return false;
    } else {
      iptMsg.value.errorMsg = "√";
      return true;
    }
  } else {
    if (rePwd === undefined || rePwd.length < 4) {
      iptMsg.value.reErrorMsg = "* 密码不能少于4字符";
      return false;
    } else if (rePwd !== pwd) {
      iptMsg.value.reErrorMsg = "* 密码不一致";
      return false;
    } else {
      iptMsg.value.reErrorMsg = "√";
      // isSubmit.value = true
      return true;
    }
  }
}
// 校对用户名是否重复
const checkUsername = async (type = 0) => {
  let username = changedUser.value.username;
  // 修改时,如果和旧值一样，依然成立
  if (type !== 0) {
    console.log("进入了修改时代");
    if (
      username == null ||
      username === "" ||
      username === aOldUser.value.username
    ) {
      iptMsg.value.usernameErrorMsg = "√";
      f1.value = true;
      return;
    }
  }
  if (username === null || username === undefined) {
    username = "";
  }
  let { data } = await checkUsernameIsExist(username);
  if (data.isExist) {
    iptMsg.value.usernameErrorMsg = "* 用户名已经存在";
  } else {
    iptMsg.value.usernameErrorMsg = "√";
    f1.value = true;
  }
};
let f1 = ref(false);
// 综合所有校验，保证所有校验都通过才能提交
function checkAll() {
  let f2 = checkPwd(0);
  let f3 = checkPwd(1);
  if (!tempFlag.value && funType.value !== 0) {
    return !f1.value;
  }
  return !(f1.value && f2 && f3);
}

// 存拿到的所有部门信息
let totalDept = ref([]);
const getAllDeptList = async () => {
  let { data } = await getAllDept();
  totalDept.value = data;
};
// 绑定用户选择的部门值
let chooseDept = ref();
// 存拿到的当前选中部门及其所有子部门对应的所有岗位
let needPosts = ref([]);
const getallSelfAndChildrenByDeptId = async () => {
  let aDeptId = chooseDept.value;
  console.log(aDeptId);
  let { data } = await getAllPostByDeptId(aDeptId);
  needPosts.value = data;
};
// 绑定用户选择的岗位值
let choosePost = ref("");
// 监听用户选择的部门的id，改变时重新拉请求更新可选岗位的数据
watch(chooseDept, (newValue, oldValue) => {
  getallSelfAndChildrenByDeptId().then(() => {
    //TODO 将现在的postId和新的可选的postId进行比对，如果不在可选列表中，则赋为null
    for (var i = 0; i < needPosts.value.length; i++) {
      if (choosePost.value === needPosts.value[i].id) {
        return;
      }
    }
    choosePost.value = null;
  });
});
// 修改用户
const updateThisUser = async () => {
  let pwd = changedUser.value.password;
  let updatedUser = {};
  // 从旧值中拿userId
  updatedUser.id = aOldUser.value.userId;
  // 需要改密码且密码存在的情况
  if (tempFlag.value && pwd != null && pwd != "") {
    updatedUser.password = pwd;
  }
  updatedUser.name = changedUser.value.name;
  updatedUser.username = changedUser.value.username;
  updatedUser.phone = changedUser.value.phone;
  updatedUser.deptId = chooseDept.value;
  updatedUser.postId = choosePost.value;
  console.log("=============Update===============");
  console.log(updatedUser);
  console.log("=============Update===============");
  let data = await update(updatedUser);
  //TODO 修改请求完成关闭弹窗，并给出消息提示并更新数据显示
  // 保存完毕，关闭弹窗
  dialogFormVisible.value = false;
  if (data.code !== 200) {
    errorMsg.value = data.message;
    openFailed();
    return;
  }
  successMsg.value = `修改用户${updatedUser.name}成功`;
  openSuccess();
  getPages({ keyword: "" });
  // 更新总数据，保证选中列表中数据也同步,同时保证显示数据是在重新获取数据完毕之后
  getAll().then(() => {
    chooseUsers();
  });
};
// 保存用户到数据库
const saveUser = async () => {
  changedUser.value.deptId = chooseDept.value;
  changedUser.value.postId = choosePost.value;
  changedUser.value.status = 1;
  let data = await save(changedUser.value);
  // 保存完毕，关闭弹窗
  dialogFormVisible.value = false;
  if (data.code !== 200) {
    errorMsg.value = data.message;
    openFailed();
    return;
  }
  successMsg.value = "新增用户成功";
  openSuccess();
  getPages({ keyword: "" });
};
let successMsg = ref("新增用户成功");
// 成功产生消息提示
const openSuccess = () => {
  ElMessage({
    showClose: true,
    message: successMsg.value,
    type: "success",
  });
};
let errorMsg = ref("新增用户失败");
// 新建失败产生消息提示
const openFailed = () => {
  ElMessage({
    showClose: true,
    message: errorMsg.value,
    type: "error",
  });
};

// 控制删除提示框的打开
let removeDialogOpen = ref(false);
// 拿来临时存待删的用户
let tempUser = ref({});
let removeDialogTitle = ref("");
function openRemoveDialog(user) {
  tempUser.value = user;
  removeDialogOpen.value = true;
  removeDialogTitle.value = `你确定要删除用户 “${tempUser.value.name}” 吗?`;
}
// 单个删除
const removeThisUser = async (user) => {
  console.log(user);
  console.log(user.userId);
  let res = await removeOne(user.userId);
  // 关闭弹窗
  removeDialogOpen.value = false;
  //产生提示
  if (res.code !== 200) {
    errorMsg.value = "删除失败";
    openFailed();
    return;
  }
  successMsg.value = "删除成功";
  openSuccess();
  // 更新页面
  getPages({ keyword: "" });
};

// 判断是否禁用当前开关
let isSwitchDisabled = ref(false);
// 存所有用户的账号状态
let statusValue = ref({});

const updateStatus = async (flag, oldStatus, userId) => {
  let statusNum = flag ? 1 : 0;
  // 状态值不一致，就进行修改
  if (statusNum !== oldStatus) {
    console.log("不一致");
    console.log(statusNum);
    let data = await updateUserStatus(userId, statusNum);
    console.log(data);
  }
};

const router = useRouter();
let tabHeads = ref([
  "用户名",
  "姓名",
  "手机",
  "所属角色",
  "账号状态",
  "创建时间",
  "修改时间",
  "操作",
]);
let fields = ref([
  "username",
  "name",
  "phone",
  "roleList",
  "state",
  "createTime",
  "updateTime",
]);
let users = ref([
  {
    username: "zym666",
    name: "朱大萌",
    phone: "1008611",
    roleList: [],
    state: "正常",
    createTime: "2024-03-21",
    updateTime: "2024-04-21",
  },
]);
// 将roleList转成名字拼成的字符串
function getMyRoleListNames(roleList) {
  let rolesNameStr = "";
  let i = 0;
  roleList.forEach((role) => {
    if (i === 0) {
      rolesNameStr += role.roleName;
    } else rolesNameStr += "、" + role.roleName;
    i++;
  });
  return rolesNameStr === "" ? "无角色" : rolesNameStr;
}
// 指定按钮动态边框和文字颜色
let buttonColor = ref("#4361ee");
// let chooseBoxs = ref([])
let switchValues = ref([]);

// 存储被选中的用户
let choseUsers = ref([]);
// 获取选中的用户的信息
function chooseUsers() {
  let tempList = [];
  let t = 0;
  for (var j = 0; j < allUsers.value.length; j++) {
    // let is = users.value[j].isChoose
    // 存选中值信息
    let is = choices.value[allUsers.value[j].userId];
    if (is && is !== undefined) {
      // 头像的设定
      let avatar = allUsers.value[j].avatarUrl;
      if (avatar == null || avatar === "") {
        allUsers.value[j].avatarUrl = "/src/assets/img/default_avatar.png";
      }
      tempList[t++] = allUsers.value[j];
    }
  }
  choseUsers.value = tempList;
}
// 用来存选中值(userId和isChoose进行映射),保证在重新拉请求之后选中值不会重置
let choices = ref({});

watch(
  choices.value,
  (newValue, oldValue) => {
    chooseUsers();
  },
  { deep: true }
);
// 绑定当前页数
let currentPage = ref(1);
// 每页显示的最多数目
let pageSize = ref(10);
// 总共的数目
let pageTotal = ref(10);
// 输入的条件关键字
let iptValue = ref("");
//  按下回车触发的方法
function handleEnter() {
  // 按下回车键时执行的逻辑
  console.log("===============================================");
  console.log("你按下了回车键，输入的值是:", iptValue.value);
  console.log("===============================================");
  getPages({ keyword: iptValue.value });
  // 逻辑完成清除输入值
  iptValue.value = "";
}
const getPages = async (obj = { keyword: "" }) => {
  // let {data} = await getPageUsers(currentPage.value,pageSize.value,{keyword:''});
  let { data } = await getPageUsers(currentPage.value, pageSize.value, obj);
  users.value = data.records;
  pageTotal.value = data.total;
  console.log("==============Data==================");
  console.log(users.value);
  console.log("==============Data==================");
};
// 页数改变时加载一次分页数据
function handleCurrentChange() {
  getPages({ keyword: "" });
}
// 单页面最大数目改变时再加载
function handleSizeChange() {
  getPages({ keyword: "" });
}
// 重置分页页面显示
function resetPage() {
  currentPage.value = 1;
  pageSize.value = 10;
  getPages({ keyword: "" });
}
// 存拿到的所有用户信息
let allUsers = ref([]);
const getAll = async () => {
  let { data } = await getAllUserMsg();
  allUsers.value = data;
  // 将本次拿到的所有userId对应的chice都映射成false,并将status通过数字映射成boolean
  for (var i = 0; i < data.length; i++) {
    let statusNum = data[i].status;
    statusValue.value[data[i].userId] = statusNum == 1;
    if (!choices.value[data[i].userId]) {
      choices.value[data[i].userId] = false;
    }
  }
};
onMounted(() => {
  console.log("进入onMounted");
  // 初始时加载一次分页的数据
  getPages();
  getAll();
  // 弹窗使用所需数据的加载
  getAllDeptList();
  // 初始化可选择的部门
  getallSelfAndChildrenByDeptId();
  // 获取全部的管理员
  // getAllRoleList()
});
</script>

<style lang="scss" scoped>
@import "/src/styles/globalPage.scss";
@import "/src/styles/listSize.scss";
@import "/src/styles/commonStyles.scss";

.userManngerAll {
  margin-left: $left-distance;
  margin-top: $top-distance;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: $page-back-color;
  padding: $page-padding;
  .tableBox {
    width: 74%;
    // max-height: 78vh;
    padding: 1vh 2vw;
    .tableFuns {
      width: 100%;
      margin-top: 1vh;
      margin-bottom: 2vh;
      display: flex;
      align-items: center;
      user-select: none;
      .actBtn {
        margin-right: 1vw;
      }
      .myIpt {
        width: 40vw;
        height: 4vh;
        box-shadow: $small-box-shadow;
      }
      :deep() {
        .dialog {
          .errMsg {
            color: $tip-font-color;
            font-size: 13px;
          }
          .el-dialog__header {
            text-align: center;
            margin-left: 48px;
            color: $title-font-color;
          }
          .el-form {
            display: flex;
            flex-wrap: wrap;
          }
          .dialog-footer {
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }
      }
    }
    :deep() {
      .dialog {
        .errMsg {
          color: $tip-font-color;
          font-size: 13px;
        }
        .el-dialog__header {
          text-align: center;
          margin-left: 48px;
          color: $title-font-color;
        }
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .dialog-footer {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .checkBoxes {
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
      }
    }
    .table {
      box-shadow: 0px 0px 2px $box-shadow-color;
      width: 100%;
      // height: 90%;
      // border: #000 1px solid;
      border-collapse: collapse;
      // justify-content: center;
      .ltr {
        // min-height: 5vh;
        // border: #000 1px solid;
        // color: rgb(136,136,136);
        color: $title-font-color;
        width: 100%;
        font-size: $common-font-size;
        text-align: center;
        th {
          max-height: 2vh;
          border: rgb(236, 239, 246) 1px solid;
          // background: rgb(220,231,255);
        }
        td {
          padding: 0 0;
          height: 5vh;
          border: rgb(236, 239, 246) 1px solid;
          .sp {
            width: 100%;
            height: 100%;
          }
        }
        .td2 {
          padding: 0 0;
          // height: 100%;
          width: 2vw;
          border: rgb(236, 239, 246) 1px solid;
        }
      }
      .ltrBackColor {
        background: rgb(250, 250, 250);
      }
    }
    .usePage {
      margin-top: 2vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .page {
        $page-font-size: $common-font-size;
        padding: 0 0;
        margin: 0 0;
        font-size: $page-font-size;
        :deep() {
          .el-select--default {
            width: 6vw;
            font-size: $page-font-size;
          }
          .el-tooltip__trigger {
            font-size: $page-font-size;
            height: 4vh;
            min-height: 1vh;
          }
          .el-select__suffix {
            .el-select__icon {
              font-size: $page-font-size;
            }
          }
          .btn-prev,
          .btn-next {
            .el-icon {
              font-size: $page-font-size;
            }
          }
          .el-pager {
            .number {
              font-size: $page-font-size;
            }
            .el-icon {
              font-size: $page-font-size;
            }
          }
          .el-pagination__jump {
            .el-pagination__goto {
              font-size: 0px;
            }
            .el-input__wrapper {
              height: 4vh;
              font-size: $page-font-size;
              padding: 0 0;
            }
          }
        }
      }
    }
  }
  .chooseUsers {
    width: 15vw;
    .boxTitle {
      padding: 0.5vh 0;
      text-align: center;
      font-size: $common-font-size;
      font-weight: 550;
      color: $title-font-color;
    }
    .userCard {
      min-height: 22.42vh;
      margin: 3vh 0;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .avatar {
        margin-top: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .msg {
        width: 100%;
        text-align: center;
        user-select: none;
        font-size: $common-font-size - 2px;
        color: #878d98;
        font-family: "幼圆";
        .name {
          font-size: $title-font-size;
          font-weight: bolder;
          color: black;
        }
      }
    }
  }
}
</style>