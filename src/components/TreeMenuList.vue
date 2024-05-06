<!-- 菜单树型列表的展示 -->
<template>
    <div class="allTreeList" v-for="(menu,i) in menuDataList" :key="i">
        <div class="listOneBar"  :style="getBorder(menu.children ==null)"  >
            <div class="msg" @click="checkDetailDialog(menu)">
                <span class="icoRound iconfont" v-html="menu.icon"></span>
                <span class="menuTxt">
                    <span class="txtTitle">{{menu.name}}</span>
                    <span v-if="menu.children != null && menu.children.length != 0" class="txt">{{`${num[floor - 1]}级父菜单`}}</span>
                    <span v-else class="txt">子菜单</span>
                </span>
            </div>
            <treeList v-if="menu.children != null && menu.children.length != 0" :parentName="getChildrenAllParentName(menu)" :menuDataList="menu.children" :floor="floor + 1" />
        </div>
    </div>
    <!-- 查看菜单的对话框 -->
    <el-dialog v-model="openDialog" :title="detailTitle" width="600"
    draggable :close-on-click-modal="false">
        <el-form :model="form">
            <el-form-item label="菜单名称">
                <el-input v-model="checkedMenu.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="菜单类型">
                <el-input v-model="checkedMenu.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="菜单路径">
                <el-input v-model="checkedMenu.path" autocomplete="off" />
            </el-form-item>
            <el-form-item label="组件路径">
                <el-input v-model="checkedMenu.component" autocomplete="off" />
            </el-form-item>
            <el-form-item label="菜单图标">
                <div class="iconfont ico" v-html="checkedMenu.icon"></div>
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
                <el-button type="primary" @click="openDialog = false">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import treeList from '@/components/TreeMenuList.vue'
import { onMounted } from 'vue'

let props = defineProps({
	menuDataList: {
		type: Array,
		default(){
			return []
		}
	},
    floor: {
        type: Number,
        default(){
			return 1
		}
    },
    parentName: {
        type: String,
        default(){
            return ''
        }
    }
})
let num = ref(['一','二','三','四','五','六','七','八','九','十'])

function getBorder(f){
    return f ? {borderBottom: 'rgb(209,213,219) 1px solid',marginLeft: props.floor + 'vw'} : {marginLeft: props.floor + 'vw'};
}
//
let detailTitle = ref('')
// 控制对话框的开关
let openDialog = ref(false)
// 存当前查看的菜单对象
let checkedMenu = ref({})
function checkDetailDialog(menu){
    checkedMenu.value = menu
    let needMyName = props.floor === 1 ?  `${menu.name}` : ` >> ${menu.name}`
    detailTitle.value = `修改“  ${props.parentName}${needMyName}  ”`
    openDialog.value = true
}

function getChildrenAllParentName (menu){
    // 非顶级菜单的目录
    if(props.floor > 1){
        return `${props.parentName} >> ${ menu.name }`
    }
    return menu.name + ''
}

function getMyParentName (){
    let menus = props.menuDataList
    console.log('')
    console.log(`=================第${props.floor}层的菜单的父菜单名称=======↓========>>>>>>>>>`)
    console.log(props.parentName)
    // for(var i = 0;i < menus.length;i++){
    //     console.log(menus[i].name)
    //     // menus[i].parentName
    // }
    console.log(`=================第${props.floor}层的菜单的父菜单名称=======↑========>>>>>>>>>`)
    console.log('')
}
// getMyParentName()
</script>

<style lang="scss" scoped>
@import url('/src/assets/font-icon/iconfont.css');
@import '/src/styles/commonStyles.scss';
@import '/src/styles/listSize.scss';


.allTreeList{
    width: 100%;
    // padding: 1vh 2vw;
    border-bottom: rgb(209,213,219) 1px solid;
    user-select: none;
    .listOneBar{
        padding: 3vh 0;
        margin: 1vh 0;
        // border-bottom: rgb(209,213,219) 1px solid;
        .msg{
            @include flex-box;
            justify-content: left;
            .icoRound{
                @include flex-box;
                width: 45px;
                height: 45px;
                background: rgb(209,213,219);
                border-radius: 50%;
                color: #FFF;
                font-size: 20px;
            }
            .menuTxt{
                @include flex-box;
                margin-left: 1vw;
                justify-content: left;
                .txtTitle{
                    font-weight: bold;
                    width: 100%;
                    margin-bottom: 1vh;
                }
                .txt{
                    color: rgb(209,213,219);
                    font-size: $common-font-size;
                }
            }
        }
        .msg:hover{
            color: $main-show-color;
            .icoRound{
                background: #FFF;
                color: $main-show-color;
                border: $main-show-color 1px solid;
            }
            .txt{
                color: $main-show-color;
            }
        }
        .msg:active{
            color: $ipt-font-color;
            .icoRound{
                background: #FFF;
                color: $ipt-font-color;
                border: $ipt-font-color 1px solid;
            }
            .txt{
                color: $ipt-font-color;
            }
        }
    }
    
    .ico{
        font-size: 30px;
        color: $ipt-font-color;
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
                // @include flex-box;
                .el-form-item{
                    width: auto;
                    min-width: 0;
                    // @include flex-box;
                    .el-form-item__label{
                        font-size: $common-font-size + 1;
                    }
                }
            }
            .dialog-footer{
                @include flex-box
            }
        }
    }
</style>