<template>
    <div class="menuPageAll">
        <div class="funTitle">菜单列表</div>
        <div class="funs">
            <div class="funBar">
                <myInputBar back-color="rgb(229,231,235)" font-color="rgb(36,47,87)"
                radius="35px" holder-color="rgb(183,190,200)" style="height: 4vh;width: 55vw;"
                @on-enter="handleEnter" v-model="iptValue" text="搜索菜单，请输入菜单名" />
                <el-button type="primary" style="border-radius: 50px;" @click="saveMenuInit()">＋ 新增菜单</el-button>
            </div>
            <div class="funTreeList">
                <div>
                    <treeMenuList :menuDataList="menus" />
                </div>
            </div>
        </div>
    
        <!-- 查看/修改/新建 菜单的对话框 -->
        <el-dialog v-model="openDialog" :title="detailTitle" width="500"
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
                <span class="iconfont ico" v-html="checkedMenu.icon"></span>
                <el-select
                v-model="checkedMenu.icon"
                filterable
                placeholder="选择图标"
                >
                    <el-option
                    v-for="(icon,i) in iconList"
                    :key="i"
                    :label="`${i} 号图标`"
                    :value="icon"
                    >
                        <div v-html="icon" class="iconfont ico"></div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上级菜单">
                <el-select
                v-model="checkedMenu.parentId"
                filterable
                placeholder="选择上一级菜单"
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
            <el-form-item label="创建时间" v-if="funType === 1">
                <div>{{checkedMenu.createTime}}</div>
            </el-form-item>
            <el-form-item label="修改时间" v-if="funType === 1">
                <div>{{checkedMenu.updateTime}}</div>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="openDialog = false">取消</el-button>
                <el-button v-if="funType === 1" type="danger" @click="removeOneMenu()">删除</el-button>
                <el-button type="primary" @click="saveOrupdateChangeMenu()">保存</el-button>
            </div>
        </template>
    </el-dialog>
    </div>


</template>

<script setup>
import myInputBar from "@/components/MyInputBar.vue"
import treeMenuList from "@/components/TreeMenuList.vue"
import { getAllTreeMenus,getMenuListByKeyword,updateMenu,getParentMenuAll,removeOneMenuById,saveMenu } from '@/api/menu'
import { isSpace } from '@/utils/stringUtil'
import{useSimpleConfirm,useWarningConfirm,useTips} from '@/utils/msgTip'
import { iconList, typeList } from '@/utils/staticData'
import { getCurrentInstance } from 'vue'
import { onMounted } from "vue";



// 对话框title
let detailTitle = ref('')
// 存当前查看的菜单
let checkedMenu = ref({})
// 表示当前对话框的功能 0: 新建; 1: 修改
let funType = ref(0)
// 控制对话框的开关
let openDialog = ref(false)
function openSaveMenuDialog(){
    openDialog.value = true
}
// 接收输入关键字
let iptValue = ref("")
// 存拿到的树型菜单列表
let menus = ref({})
console.log(menus.value)
// 初始化新建菜单的弹窗
function saveMenuInit(){
    detailTitle.value = '添加新菜单'
    checkedMenu.value = {}
    funType.value = 0
    openDialog.value = true
}

// 条件查询
const getMenusByKey = async()=>{
    let {data} = await getMenuListByKeyword(iptValue.value);
    menus.value = data
}
// 按下回车，进行搜索
function handleEnter(){
    console.log(iptValue.value)
    if(isSpace(iptValue.value)){
        getAllNodes().then(()=>{
            iptValue.value = ''
        })
        return
    }
    getMenusByKey().then(()=>{
        iptValue.value = ''
    })
}
// 修改/新建 菜单的总方法
function saveOrupdateChangeMenu(){
    if(funType.value === 1){
        updateChangeMenu()
    }else{
        saveThisMenu()
    }
}
// 新建菜单的具体方法
function saveThisMenu (){
    useSimpleConfirm('你确定要保存新建的菜单吗').then(async ()=>{
        console.log('=========>>>>')
        console.log(checkedMenu.value)
        console.log('=========>>>>')
        let data = await saveMenu(checkedMenu.value)
        openDialog.value = false
        useTips('新建菜单成功',data)
    })
}
// 修改菜单的具体方法
function updateChangeMenu(){
    if(checkedMenu.value.parentId === checkedMenu.value.id){
        useWarningConfirm('上级菜单不可以是自己本身!!!')
        return
    }
    useSimpleConfirm(`你确定要保存对菜单 “${checkedMenu.value.totalName}” 的修改吗?`).then(async ()=>{
        // 防止修改日期不同步的问题
        checkedMenu.value.updateTime = null
        let data = await updateMenu(checkedMenu.value)
        openDialog.value = false
        useTips(`成功对菜单 “${checkedMenu.value.totalName}” 进行修改`,data)
    })
}
// 删除单个菜单
function removeOneMenu(){
    useSimpleConfirm(`你确定要删除菜单 “${checkedMenu.value.totalName}” 吗？？？`).then(async ()=>{
        let data = await removeOneMenuById(checkedMenu.value.id)
        openDialog.value = false
        useTips(`成功删除菜单 “${checkedMenu.value.totalName}”`,data)
    })
}

// 存所有父级菜单基础信息
let parentMenusMsg = ref([])
// 获取所有的非按钮菜单的列表（含父级字符串）用于搞直接父级菜单选择
const getAllParentMenus = async()=>{
    let {data} = await getParentMenuAll()
    parentMenusMsg.value = data
}
// 获取所有菜单的树型列表
const getAllNodes = async()=>{
    let {data} = await getAllTreeMenus()
    menus.value = data
}

// 接收树型子组件传来的待查看的menu
const cxt  = getCurrentInstance()
const bus = cxt.appContext.config.globalProperties.$bus
bus.on('menuEvent',(menu)=>{
    console.log('======================>>>>>>')
    console.log(menu)
    console.log('======================>>>>>>')
    checkedMenu.value = menu
    detailTitle.value = `修改“  ${menu.totalName}  ”`
    funType.value = 1
    openDialog.value = true
})
onMounted(()=>{
    getAllNodes()
    getAllParentMenus()
})

onBeforeUnmount(()=>{
    bus.off('menuEvent')
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/globalPage.scss';
@import '/src/styles/listSize.scss';
@import '/src/styles/commonStyles.scss';
.menuPageAll{
    margin-left: $left-distance;
    margin-top: $top-distance;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background: rgb(244,247,252);
    padding: $page-padding;
    .funs{
        box-shadow: $small-box-shadow;
        background: #FFF;
        width: 100%;
        padding: 2vh 1vw;
        .funBar{
            @include flex-box;
            justify-content: space-between;
            margin-bottom: 1vh;
        }
        .funTreeList{
            // padding: 1vh 2vw;
            box-shadow: 0px 0px 3px $box-shadow-color;
        }
    }
    :deep(){
        .el-dialog,.is-draggable{
            .el-dialog__header,.show-close{
                @include flex-box;
                text-align: center;
                color: $title-font-color;
                .el-dialog__title{
                    font-size: $title-font-size;
                }
            }
            .el-form{
                @include flex-box;
                .el-form-item{
                    width: 80%;
                    min-width: 0;
                    @include flex-box;
                    .el-form-item__label{
                        font-size: $common-font-size + 1;
                    }
                    .ico{
                        color: $main-show-color;
                        font-size: 35px;
                    }
                    .el-form-item__content{
                        flex-wrap: nowrap;
                    }
                }
            }
            .dialog-footer{
                @include flex-box
            }
        }
    }
}
</style>